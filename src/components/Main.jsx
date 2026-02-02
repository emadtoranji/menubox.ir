export default function Main({ children, customClass }) {
  return (
    <main
      className={`container-fluid flex-grow-1 p-0 ${
        customClass ? customClass : ''
      }`}
    >
      {children}
    </main>
  );
}
