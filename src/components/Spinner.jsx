export default function Spinner({ small = false, type = '', center = true }) {
  if (!['border', 'grow'].includes(type)) {
    type = 'border';
  }

  return (
    <div
      className={`d-flex ${center ? 'justify-content-center' : ''} align-items-center mx-auto spinner-${type} spinner-${type}${
        small ? '-sm' : ''
      }`}
      role='status'
    >
      <span className='visually-hidden'>Loading...</span>
    </div>
  );
}
