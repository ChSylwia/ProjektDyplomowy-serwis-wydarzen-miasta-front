import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg z-10'>
      <h1 className='text-3xl font-bold text-center mb-6'>Polityka Prywatności</h1>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>I. Postanowienia ogólne</h2>
        <p>
          Administratorem danych osobowych zbieranych za pośrednictwem strony internetowej
          www.hwileplocka.tech jest Sylwia Chędkowska - student Akademii Mazowieckiej w Płocku,
          zwany dalej "Administratorem".
        </p>
        <p>Kontakt: chedkowska0@gmail.com</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>II. Zakres zbieranych danych</h2>
        <ul className='list-disc ml-6'>
          <li>Imię i nazwisko</li>
          <li>Adres e-mail</li>
          <li>Dane logowania (login, hasło)</li>
          <li>Informacje o dodawanych wydarzeniach</li>
          <li>Dane techniczne dotyczące urządzenia</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>III. Cele przetwarzania danych</h2>
        <p>
          Dane przetwarzane są w celu rejestracji użytkowników, dodawania wydarzeń i integracji z
          Google Calendar.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>IV. Prawa użytkowników</h2>
        <ul className='list-disc ml-6'>
          <li>Prawo dostępu do danych</li>
          <li>Prawo do sprostowania</li>
          <li>Prawo do usunięcia danych</li>
          <li>Prawo do przenoszenia danych</li>
        </ul>
      </section>
    </div>
  )
}

export default PrivacyPolicy
