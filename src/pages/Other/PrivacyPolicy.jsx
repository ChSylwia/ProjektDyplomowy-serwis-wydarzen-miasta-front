import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg z-10'>
      <h1 className='text-3xl font-bold text-center mb-6'>Polityka Prywatności</h1>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>I. Postanowienia ogólne</h2>
        <p>
          Administratorem danych osobowych zbieranych za pośrednictwem strony internetowej
          www.chwileplocka.tech jest Sylwia Chędkowska - student Akademii Mazowieckiej w Płocku,
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
          <li>Dane techniczne dotyczące urządzenia (np. adres IP, typ przeglądarki)</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>III. Cele przetwarzania danych</h2>
        <p>Dane przetwarzane są w celu:</p>
        <ul className='list-disc ml-6'>
          <li>Rejestracji i zarządzania kontami użytkowników</li>
          <li>Umożliwienia dodawania i zarządzania wydarzeniami</li>
          <li>Integracji z Google Calendar w celu synchronizacji wydarzeń</li>
          <li>Poprawy jakości usług oraz zapewnienia bezpieczeństwa</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>IV. Podstawa prawna przetwarzania danych</h2>
        <p>
          Przetwarzanie danych osobowych odbywa się na podstawie zgody użytkownika, a także w
          zakresie niezbędnym do wykonania umowy o świadczenie usług oferowanych przez
          Administratora.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>V. Udostępnianie danych</h2>
        <p>Dane użytkowników mogą być udostępniane następującym podmiotom:</p>
        <ul className='list-disc ml-6'>
          <li>Google LLC – w celu integracji z usługą Google Calendar</li>
          <li>Podmiotom świadczącym usługi hostingowe i utrzymania serwera</li>
          <li>Uprawnionym organom państwowym na podstawie obowiązujących przepisów prawa</li>
        </ul>
        <p>
          Administrator nie sprzedaje ani nie udostępnia danych użytkowników w celach
          marketingowych.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>VI. Ochrona danych</h2>
        <p>
          Administrator stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych
          osobowych przed nieuprawnionym dostępem, utratą czy zniszczeniem. Do stosowanych
          zabezpieczeń należą m.in.:
        </p>
        <ul className='list-disc ml-6'>
          <li>Szyfrowanie transmisji danych (SSL/TLS)</li>
          <li>Regularne aktualizacje systemów i oprogramowania</li>
          <li>Kontrola dostępu do danych</li>
          <li>Regularne kopie zapasowe</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>VII. Okres przechowywania danych</h2>
        <p>
          Dane osobowe są przechowywane przez okres niezbędny do realizacji celów, dla których
          zostały zebrane, lub zgodnie z obowiązującymi przepisami prawa. Po tym czasie dane są
          usuwane lub anonimizowane.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>VIII. Prawa użytkowników</h2>
        <p>Użytkownikom przysługują następujące prawa:</p>
        <ul className='list-disc ml-6'>
          <li>Prawo dostępu do swoich danych</li>
          <li>Prawo do sprostowania danych</li>
          <li>Prawo do usunięcia danych (prawo do bycia zapomnianym)</li>
          <li>Prawo do ograniczenia przetwarzania</li>
          <li>Prawo do przenoszenia danych</li>
          <li>Prawo do wniesienia sprzeciwu wobec przetwarzania</li>
          <li>Prawo do cofnięcia zgody na przetwarzanie danych</li>
          <li>Prawo do wniesienia skargi do organu nadzorczego</li>
        </ul>
        <p>
          W celu realizacji powyższych praw należy skontaktować się z Administratorem za
          pośrednictwem podanego adresu e-mail.
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold'>IX. Zmiany w polityce prywatności</h2>
        <p>
          Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej polityce
          prywatności. O wszelkich zmianach użytkownicy będą informowani z odpowiednim wyprzedzeniem
          poprzez stronę internetową lub drogą mailową.
        </p>
      </section>
    </div>
  )
}

export default PrivacyPolicy
