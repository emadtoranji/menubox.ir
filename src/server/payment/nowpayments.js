import { PAYMENT_GATEWAY_CALLBACK_URL } from '@utils/globalSettings';
import { currencyExchanger } from '@utils/exchanger';

export async function nowpayments_create_bill({
  amount,
  currency,
  order_id,
  description = '',
}) {
  const api_key = process.env.PAYMENT_GATEWAY_NOWPAYMENTS_KEY;
  const callback_url = PAYMENT_GATEWAY_CALLBACK_URL + 'nowpayments';
  if (!api_key) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
    };
  }
  const finalAmount = currencyExchanger(amount, currency, 'usd');
  if (isNaN(finalAmount) || finalAmount <= 0) {
    return {
      ok: false,
      message: 'INVALID_EXCHANGE_RATE',
    };
  }

  const res = await fetch('https://api.nowpayments.io/v1/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': api_key },
    body: JSON.stringify({
      merchant: api_key,
      price_amount: finalAmount,
      price_currency: 'usd',
      order_id: order_id,
      order_description: description,
      ipn_callback_url: callback_url, // TODO
      success_url: callback_url,
      cancel_url: callback_url,
    }),
  });

  const reuslt = await res.json();

  if (reuslt?.invoice_url) {
    return {
      ok: true,
      result: {
        authority: reuslt?.id || reuslt?.payment_id, // TODO
        payment_url: reuslt?.invoice_url,
      },
    };
  } else {
    return {
      ok: false,
      message: 'PAYMENT_GATEWAY_CREATE_ERROR',
    };
  }
}
export async function nowpayments_verify_bill({ db_amount, payment_id }) {
  const api_key = process.env.PAYMENT_GATEWAY_NOWPAYMENTS_KEY;
  if (!api_key || isNaN(db_amount) || !payment_id) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
    };
  }
  const res = await fetch(
    `https://api.nowpayments.io/v1/payment/${payment_id}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': api_key },
      body: JSON.stringify({}),
    }
  );

  const result = await res.json();
  if (result) {
    const res_status = result.payment_status;
    if (['finished', 'confirmed'].includes(res_status)) {
      return {
        ok: true,
        result: {
          amount: result.price_amount,
          currency: result.price_currency,
          reference_id: result?.payment_id || null,
          paid_at: null, // TODO
        },
        status: 'success',
      };
    } else if (['waiting', 'sending'].includes(res_status)) {
      return {
        ok: false,
        status: 'need-more-time',
      };
    } else if (res_status === 'partially_paid') {
      return {
        ok: false,
        status: 'partially-paid',
      };
    } else if (res_status === 'failed') {
      return {
        ok: false,
        status: 'failed',
      };
    } else if (res_status === 'refunded') {
      return {
        ok: false,
        status: 'refunded-by-gateway',
      };
    } else if (res_status === 'expired') {
      return {
        ok: false,
        status: 'expired',
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
