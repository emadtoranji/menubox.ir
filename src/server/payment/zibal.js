import { PAYMENT_GATEWAY_CALLBACK_URL } from '@utils/globalSettings';
import { currencyExchanger } from '@utils/exchanger';

// https://help.zibal.ir/IPG/API/

export async function zibal_create_bill({
  amount,
  currency,
  order_id,
  description = '',
}) {
  const api_key = process.env.PAYMENT_GATEWAY_ZIBAL_KEY;
  const callback_url = PAYMENT_GATEWAY_CALLBACK_URL + 'zibal';
  if (!api_key) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
    };
  }
  const finalAmount = currencyExchanger(amount, currency, 'irr');
  if (isNaN(finalAmount) || finalAmount <= 0) {
    return {
      ok: false,
      message: 'INVALID_EXCHANGE_RATE',
    };
  }

  const res = await fetch('https://gateway.zibal.ir/v1/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant: api_key,
      orderId: order_id,
      amount: finalAmount,
      callbackUrl: callback_url,
      description,
    }),
  });

  const reuslt = await res.json();

  if (reuslt?.trackId) {
    const payment_url = `https://gateway.zibal.ir/start/${reuslt.trackId}`;
    return {
      ok: true,
      result: {
        authority: reuslt.trackId,
        payment_url,
      },
    };
  } else {
    return {
      ok: false,
      message: 'PAYMENT_GATEWAY_CREATE_ERROR',
    };
  }
}
export async function zibal_verify_bill({ db_amount, trackId }) {
  const api_key = process.env.PAYMENT_GATEWAY_ZIBAL_KEY;
  if (!api_key || isNaN(db_amount) || !trackId) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
    };
  }
  const res = await fetch('https://gateway.zibal.ir/v1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant: api_key,
      trackId: trackId,
    }),
  });

  const result = await res.json();
  if (result) {
    const res_status = result.result;
    if ([1, 2, 100, 201].includes(res_status) && result?.amount) {
      const finalAmount = currencyExchanger(db_amount, 'irt', 'irr');
      if (isNaN(finalAmount) || finalAmount <= 0) {
        return {
          ok: false,
          status: 'null',
        };
      }

      if (finalAmount >= result.amount) {
        return {
          ok: true,
          result: {
            amount: result.amount,
            currency: 'irr',
            reference_id: result?.refNumber || null,
            paid_at: result?.paidAt ? new Date(result.paidAt) || null : null,
          },
          status: 'success',
        };
      } else {
        return {
          ok: false,
          status: 'partially-paid',
        };
      }
    } else if ([-1, 7].includes(res_status)) {
      return {
        ok: false,
        status: 'need-more-time',
      };
    } else if ([3, 202, 15, 16].includes(res_status)) {
      return {
        ok: false,
        status: 'failed',
      };
    } else {
      return {
        ok: false,
        status: 'failed',
      };
    }
  } else {
    return {
      ok: false,
      status: null,
    };
  }
}
