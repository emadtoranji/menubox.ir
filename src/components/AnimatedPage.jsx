export default function Index({ children, custom }) {
  return (
    <div className={`animate__animated ${custom ? custom : 'animate__fadeIn'}`}>
      {children}
    </div>
  );
}
