# Kasa — jak uruchomić na dwóch telefonach

Ta instrukcja jest dla Ciebie, nie dla programisty. Robisz to raz, zajmuje
około pół godziny. Nic nie kosztuje.

Efekt: Twoja kobieta prowadzi budżet na swoim telefonie, Ty widzisz to samo
na swoim, a zakładka Biznes jest tylko u Ciebie.

---

## Zanim zaczniesz

Potrzebujesz:

- konta Google (do Firebase),
- dwóch adresów e-mail — jednego dla Ciebie, jednego dla niej,
- 30 minut przy komputerze. Z telefonu tego nie zrobisz.

Kolejność ma znaczenie: **najpierw Firebase, potem hosting.** Odwrotnie
skończy się tym, że wrzucisz na serwer wersję bez synchronizacji.

---

## Część 1 — Firebase (wspólna baza)

### Krok 1. Załóż projekt

1. Wejdź na <https://console.firebase.google.com> i zaloguj się kontem Google.
2. **Utwórz projekt** → nazwa: `kasa` → Dalej.
3. Google Analytics: **wyłącz**. Nie jest do niczego potrzebne.
4. Poczekaj, aż projekt się utworzy → **Kontynuuj**.

### Krok 2. Włącz logowanie e-mailem

1. W menu po lewej: **Build → Authentication** → **Get started**.
2. Zakładka **Sign-in method** → **Email/Password** → włącz pierwszy
   przełącznik (drugi, „passwordless", zostaw wyłączony) → **Save**.

### Krok 3. Załóż dwa konta

1. Zakładka **Users** → **Add user**.
2. Wpisz **swój** e-mail i hasło → **Add user**.
3. Jeszcze raz **Add user** → e-mail i hasło **dla niej**.

Hasła wymyśl teraz i zapisz w menedżerze haseł. To nie są konta Google —
to konta tylko do tej aplikacji.

### Krok 4. Utwórz bazę

1. W menu: **Build → Firestore Database** → **Create database**.
2. Lokalizacja: **eur3 (europe-west)** albo inna europejska. Wybierasz raz,
   nie da się później zmienić.
3. Tryb: **Start in production mode** → **Create**.

### Krok 5. Ustaw, kto ma dostęp

1. W Firestore wejdź w zakładkę **Rules**.
2. Skasuj to, co tam jest, i wklej poniższe. **Podmień oba adresy e-mail
   na Wasze** — te same, które wpisałeś w kroku 3:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /budzety/{dom} {
      allow read, write: if request.auth != null
        && request.auth.token.email in [
             'twoj@email.pl',
             'jej@email.pl'
           ];
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Publish**.

Te reguły znaczą: do budżetu wchodzą wyłącznie te dwa adresy. Nikt inny,
nawet gdyby znał adres strony. Reszta bazy jest zamknięta na głucho.

### Krok 6. Podłącz aplikację

1. W Firebase kliknij **⚙ → Project settings**.
2. Zjedź do **Your apps** → ikona **`</>`** (Web).
3. Nazwa aplikacji: `kasa` → **Register app**. Firebase Hosting: **nie
   zaznaczaj**.
4. Zobaczysz blok tekstu z `apiKey`, `authDomain`, `projectId` i tak dalej.

Otwórz plik **`konfiguracja.js`** w Notatniku (albo dowolnym edytorze
tekstu) i przepisz te wartości między cudzysłowy. Wygląda to tak:

```js
firebase: {
  apiKey:            "AIzaSy...",
  authDomain:        "kasa-1234.firebaseapp.com",
  projectId:         "kasa-1234",
  storageBucket:     "kasa-1234.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abc123"
},
```

W tym samym pliku, niżej:

- **`dom`** — nazwa Waszego budżetu, np. `"nasz-budzet"`. Bez spacji i bez
  polskich znaków. Nie zmieniaj jej później, bo trafisz na pusty budżet.
- **`szef`** — **Twój** adres e-mail. Na telefonie zalogowanym na ten adres
  pojawi się zakładka Biznes.

Zapisz plik.

> **`apiKey` to nie jest hasło.** Wygląda groźnie, ale jest publiczny —
> siedzi w kodzie każdej strony korzystającej z Firebase. Dostępu pilnują
> reguły z kroku 5, nie ten klucz. Nie musisz go ukrywać.

---

## Część 2 — Hosting (żeby wchodziło z telefonu)

Bez tego aplikacja jest luźnym plikiem, który na telefonie otwiera się
fatalnie i którego dane potrafią zniknąć przy czyszczeniu przeglądarki.

### Najprostsza droga: Netlify Drop

1. Wejdź na <https://app.netlify.com/drop>.
2. Przeciągnij **cały folder `kasa`** na stronę.
3. Po kilkunastu sekundach dostaniesz adres w stylu
   `losowa-nazwa-123.netlify.app`.
4. Załóż darmowe konto (inaczej strona zniknie po dobie) i w
   **Site settings → Change site name** ustaw coś sensownego, np.
   `kasa-wojtek` → adres: `kasa-wojtek.netlify.app`.

Alternatywa: **Cloudflare Pages** → *Create a project* → *Direct Upload*.
Ta sama zasada, ten sam koszt.

### Gdy coś zmienisz w plikach

Wejdź w **Deploys** i przeciągnij folder jeszcze raz. Nadpisze poprzednią
wersję.

---

## Część 3 — Oba telefony

Na **każdym** telefonie osobno:

1. Otwórz adres strony w przeglądarce (na iPhonie **musi** być Safari —
   inaczej nie da się zainstalować).
2. **Udostępnij → Dodaj do ekranu początkowego** (iPhone) albo
   **⋮ → Zainstaluj aplikację** (Android).
3. Otwórz aplikację z ikony.
4. Wybierz rolę telefonu:
   - jej telefon → **Dom, zakupy i spiżarnia**
   - Twój → **Wszystko razem z biznesem**
5. Zaloguj się swoim adresem i hasłem z kroku 3.

Gotowe. W nagłówku pojawi się zielony znaczek **„wspólny"**.

### Pierwsze wypełnienie

Zrób to **na jednym telefonie**, najlepiej razem przy stole:

1. ⚙ → wypłata netto na 4 tygodnie i data dowolnej wypłaty.
2. Koszty stałe: huur, zorgverzekering, energia, internet, telefon.
3. Toeslagen, jeśli dostajecie.
4. Spiżarnia: produkty, które kupujecie regularnie, i ile dni starcza jedno
   opakowanie. To najważniejsze 20 minut całej konfiguracji — bez tego lista
   zakupów nie będzie się uzupełniać sama.
5. Na drugim telefonie wszystko pojawi się w kilka sekund.

---

## Co znaczy znaczek w nagłówku

| Znaczek | Co się dzieje |
|---|---|
| **wspólny** (zielony) | Wszystko zsynchronizowane. |
| **wysyłam…** (niebieski) | Trwa zapis, sekunda–dwie. |
| **offline — dośle** (żółty) | Brak internetu. Pracuj dalej, dośle się samo. |
| **tylko ten telefon** (szary) | Brak konfiguracji albo wybrano pracę lokalną. |
| **błąd** (czerwony) | Wylogowanie albo zła reguła. Zajrzyj niżej. |

---

## Jak to działa, gdy oboje klikacie naraz

Nie nadpisujecie sobie całych budżetów. Aplikacja przy każdym zapisie
pobiera aktualną wersję z chmury, scala ją z tym, co masz na telefonie —
pozycja po pozycji — i dopiero wynik odsyła. Jeśli oboje zapiszecie w tej
samej sekundzie, drugi zapis powtarza się na świeżych danych zamiast
skasować pierwszy.

W praktyce: ona odhacza stek na liście, Ty w tym samym momencie
potwierdzasz wpłatę od klienta — obie rzeczy trafiają do budżetu.

**Dwie rzeczy, o których musisz wiedzieć:**

1. **Gdy oboje zmienicie tę samą pozycję** (np. cenę tego samego produktu)
   w ciągu kilku sekund — zostaje ta zmiana, która ma późniejszy czas.
   Druga przepada bez ostrzeżenia. Przy dwóch osobach zdarza się to rzadko,
   ale nie jest niemożliwe.
2. **Skasowanie zawsze wygrywa.** Jeśli ona skasuje wydatek w chwili, gdy Ty
   go poprawiasz — wydatek znika. Tak jest celowo: wracający wydatek
   wygląda jak błąd aplikacji i podważa zaufanie do wszystkich liczb.

---

## Prywatność — bez owijania

Zakładka Biznes chowa się na jej telefonie, ale **dane budżetu są wspólne**.
To podział ekranu dla wygody, nie zamek. Kto zna hasło do konta i umie
zajrzeć w pamięć przeglądarki, ten zobaczy wszystko.

Jeśli coś ma być naprawdę niewidoczne, nie może być w tym samym budżecie —
załóż drugi (inna wartość `dom` w konfiguracji) i trzymaj to osobno.

---

## Kopia zapasowa

Firebase to nie jest gwarancja. Raz w miesiącu, ⚙ → **Eksportuj** i zapisz
plik gdzieś poza telefonem. Zajmuje 10 sekund.

Plik z eksportu wgrywasz przez **Importuj** — dane scalą się z tym, co jest,
zamiast nadpisać.

---

## Gdy coś nie działa

**„Nie weszło — zły e-mail albo hasło"**
Konto musi istnieć w **Authentication → Users**. To nie jest konto Google
ani e-mail z poczty — tylko to, co założyłeś w kroku 3.

**Znaczek pokazuje „błąd zapisu"**
Reguły z kroku 5 mają inne adresy niż konta z kroku 3. Sprawdź literówki,
wielkość liter nie ma znaczenia.

**Widzicie różne budżety**
Wartość `dom` w `konfiguracja.js` musi być identyczna. Jeśli wrzucałeś
folder na hosting dwa razy z różnymi ustawieniami — wrzuć jeszcze raz ten
właściwy.

**Na iPhonie nie ma „Dodaj do ekranu początkowego"**
Otwierasz w Chrome albo Firefoxie. Na iOS to działa wyłącznie z Safari.

**Zmieniłem pliki, a telefon pokazuje starą wersję**
Aplikacja trzyma kopię, żeby działać bez zasięgu. Zamknij ją całkiem
(nie zwijaj — zamknij) i otwórz ponownie. Jeśli dalej stara: usuń ikonę
z ekranu i dodaj jeszcze raz.

**Ile to wytrzyma**
Cały budżet siedzi w jednym dokumencie o limicie 1 MB — to około 6–8 tysięcy
wydatków, czyli kilka lat codziennego wpisywania. Gdy się zbliżysz, trzeba
będzie archiwizować stare okresy. Darmowy pakiet Firebase to 50 tysięcy
odczytów dziennie; dwie osoby wykorzystają kilkaset.
