# 🎭 Playwright Test Automation Framework

Acest repository conține un framework modern de testare automatizată de tip End-to-End (E2E), dezvoltat utilizând **[Playwright](https://playwright.dev/)** și **TypeScript**. Arhitectura este proiectată pentru a asigura execuția rapidă, fiabilitatea și mentenanța facilă a testelor, oferind suport complet atât pentru verificarea interfețelor grafice (UI), cât și a fluxurilor API.

## 🚀 Tehnologii Utilizate

- **Framework de testare:** [Playwright](https://playwright.dev/)
- **Limbaj de programare:** [TypeScript](https://www.typescriptlang.org/)
- **Design Pattern:** Page Object Model (POM)
- **Containerizare:** Docker & Docker Compose
- **Integrare Continuă (CI/CD):** GitHub Actions
- **Formatare cod:** Prettier

## 📁 Structura Proiectului

Organizarea modulelor este realizată modular, asigurând separarea clară a responsabilităților:

```text
├── .github/workflows/    # Configurații pentru pipeline-ul de CI/CD (GitHub Actions)
├── api/                  # Clase și metode utilitare pentru testarea componentelor API
├── pages/                # Implementarea claselor specifice pattern-ului Page Object Model
├── tests/                # Suitele de teste efective (*.spec.ts)
├── utils/                # Funcții utilitare, fixtures și configurări ajutătoare
├── Dockerfile            # Specificația imaginii Docker pentru mediul Playwright
├── docker-compose.yaml   # Configurarea serviciilor pentru rularea în containere
├── playwright.config.ts  # Configurația principală a framework-ului Playwright
└── package.json          # Managementul dependențelor și al scripturilor NPM
```

## ⚙️ Cerințe Tehnice Preliminare (Prerequisites)

Pentru inițializarea și rularea proiectului, sunt necesare următoarele componente software:
- [Node.js](https://nodejs.org/) (versiune minimă recomandată: 16 sau superioară)
- [Docker](https://www.docker.com/) și Docker Compose (opțional, pentru izolarea mediului de execuție)

## 📦 Ghid de Instalare

1. Clonarea repository-ului local:
   ```bash
   git clone [https://github.com/marian-duma/playwright-test-automation.git](https://github.com/marian-duma/playwright-test-automation.git)
   cd playwright-test-automation
   ```

2. Instalarea dependențelor NPM:
   ```bash
   npm install
   ```

3. Instalarea browserelor și a dependențelor sistem specifice Playwright:
   ```bash
   npx playwright install --with-deps
   ```

## 🧪 Execuția Testelor

Framework-ul permite rularea suitelor de teste prin intermediul mai multor moduri de execuție, în funcție de cerințele procesului de validare:

**Execuția tuturor testelor (modul headless - implicit):**
```bash
npx playwright test
```

**Execuția testelor cu interfață grafică activată (modul headed):**
```bash
npx playwright test --headed
```

**Vizualizarea raportului HTML generat post-execuție:**
```bash
npx playwright show-report
```

**Lansarea modului UI interactiv (recomandat pentru depanare și dezvoltare):**
```bash
npx playwright test --ui
```

## 🐳 Rularea Testelor în Mediu Containerizat (Docker)

Pentru a asigura determinismul testelor și consistența cu mediul de producție sau CI/CD, execuția poate fi izolată complet prin Docker:

Construirea imaginii și lansarea containerelor:
```bash
docker-compose up --build
```
*Acest proces compilează mediul pe baza `Dockerfile`-ului definit și rulează automat suitele de teste în interiorul arhitecturii izolate.*

## 🔄 Integrare Continuă (CI/CD)

Framework-ul include fluxuri de lucru automatizate localizate în directorul `.github/workflows/`. La fiecare eveniment de tip `push` sau `pull request` pe branch-ul principal, pipeline-ul GitHub Actions execută automat următorii pași:
- Instalarea structurii de dependențe.
- Execuția testelor automate Playwright pe browserele țintă stabilite în fișierul de configurare.
- Generarea și arhivarea raportului HTML sub formă de artefact descărcabil din platforma GitHub.

## 📄 Licență

Acest proiect este distribuit sub termenii licenței [MIT License](LICENSE).
