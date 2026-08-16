/* ═══════════════════════════════════════════════════════════════════
   KASA — konfiguracja

   To jedyny plik, który musisz zmienić. Instrukcja krok po kroku jest
   w pliku INSTRUKCJA.md. Reszty plików nie ruszaj.

   Dopóki tu nic nie wpiszesz, aplikacja działa normalnie, ale tylko na
   jednym telefonie — bez synchronizacji.
   ═══════════════════════════════════════════════════════════════════ */

window.KASA_KONFIG = {

  /* ─── 1. Dane z Firebase ───────────────────────────────────────────
     Skopiuj tu blok, który Firebase pokaże Ci przy zakładaniu aplikacji
     internetowej (INSTRUKCJA.md, krok 4). Wklejasz same wartości.       */

  firebase: {
    apiKey:            "",
    authDomain:        "",
    projectId:         "",
    storageBucket:     "",
    messagingSenderId: "",
    appId:             ""
  },

  /* ─── 2. Nazwa Waszego wspólnego budżetu ───────────────────────────
     Dowolny tekst bez spacji i polskich znaków. Musi być IDENTYCZNY
     na obu telefonach — to po nim aplikacja poznaje, że patrzycie na
     ten sam budżet.                                                    */

  dom: "nasz-budzet",

  /* ─── 3. Kto ma dostęp do zakładki Biznes ──────────────────────────
     Wpisz swój adres e-mail (ten sam, którym się logujesz).
     Na telefonie zalogowanym na ten adres pojawi się zakładka Biznes
     i karta wyjścia z etatu. Na każdym innym — nie.

     Ważne, żeby nie było nieporozumień: to jest podział ekranu, a nie
     zamek. Dane budżetu i tak są wspólne. Kto zna hasło do konta i umie
     zajrzeć w pamięć przeglądarki, ten zobaczy wszystko. Jeśli coś ma
     być naprawdę niewidoczne, nie może być w tym samym budżecie.        */

  szef: ""

};
