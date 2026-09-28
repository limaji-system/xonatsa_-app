import "./styles.css";
import {
  register, login, currentUser, setProfile,
  createRecoveryCode, verifyRecoveryCode, logout
} from "./auth";

type Screen = "start" | "login" | "register" | "forgot" | "verify" | "profile";

const app = document.querySelector<HTMLDivElement>("#app")!;
let screen: Screen = "start";
let recoveryEmail = "";
let selectedProfile: "participant" | "organisateur" | null = null;
let message = "";

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]!));

function shell(content: string) {
  app.innerHTML = `<main class="screen"><div class="content">${content}</div></main>`;
}

function backButton(target: Screen = "login") {
  return `<div class="back" data-nav="${target}">← &nbsp;Retour</div>`;
}

function logo(large = false) {
  return `<div class="logo-space"><div class="brand-mark">X</div><div class="brand">XonaTSA</div></div>`;
}

function render() {
  message = "";
  switch (screen) {
    case "start": return renderStart();
    case "login": return renderLogin();
    case "register": return renderRegister();
    case "forgot": return renderForgot();
    case "verify": return renderVerify();
    case "profile": return renderProfile();
  }
}

function renderStart() {
  shell(`
    ${logo(true)}
    <h1 class="subtitle">CONNECTEZ-VOUS</h1>
    <p class="description">Accédez à votre compte pour gérer<br>vos événements et vos tickets.</p>
    <section class="panel">
      <div style="text-align:center;font-size:62px;margin:0 0 16px">◯</div>
      <div class="field"><span class="icon">✉</span><input id="start-email" type="email" placeholder="Adresse e-mail"></div>
      <div class="field"><span class="icon">▣</span><input id="start-password" type="password" placeholder="Mot de passe"><span id="start-eye" class="icon" style="cursor:pointer">◉</span></div>
      <div class="row"><label><input id="remember" class="check" type="checkbox" checked> Se souvenir de moi</label><span class="link" data-nav="forgot">Mot de passe oublié ?</span></div>
      <div id="start-message" class="message"></div>
      <button class="btn primary" id="login-btn">Se connecter</button>
      <button class="btn outline google" id="google-login"><span class="google-letter">G</span> Se connecter avec Google</button>
      <div class="or"><span class="divider"></span>OU<span class="divider"></span></div>
      <button class="btn outline" data-nav="register">✉ &nbsp; Créer un compte</button>
    </section>
  `);
  bindCommon();
  document.querySelector("#login-btn")?.addEventListener("click", () => {
    try {
      const email = (document.querySelector("#start-email") as HTMLInputElement).value;
      const password = (document.querySelector("#start-password") as HTMLInputElement).value;
      login(email, password); screen = "profile"; render();
    } catch (e) { setMessage("start-message", e); }
  });
  document.querySelector("#start-eye")?.addEventListener("click", () => {
    const input = document.querySelector("#start-password") as HTMLInputElement;
    input.type = input.type === "password" ? "text" : "password";
  });
  document.querySelector("#google-login")?.addEventListener("click", () => {
    setMessage("start-message", "La connexion Google nécessite la configuration de votre projet OAuth.", true);
  });
}

function renderLogin() { renderStart(); }

function renderRegister() {
  shell(`
    ${backButton("login")}
    ${logo()}
    <h1 class="subtitle">CRÉER UN COMPTE</h1>
    <p class="description">Rejoignez-nous et accédez à tous<br>les événements et tickets.</p>
    <section class="panel">
      <div class="field"><span class="icon">✉</span><input id="reg-email" type="email" placeholder="Adresse e-mail"></div>
      <div class="field"><span class="icon">▣</span><input id="reg-password" type="password" placeholder="Mot de passe"><span id="reg-eye" class="icon" style="cursor:pointer">◉</span></div>
      <div class="field"><span class="icon">▣</span><input id="reg-confirm" type="password" placeholder="Confirmer le mot de passe"><span id="reg-eye2" class="icon" style="cursor:pointer">◉</span></div>
      <div class="field"><span class="icon">●</span><select id="country"><option value="">Pays</option><option>Togo</option><option>Bénin</option><option>Ghana</option><option>Cameroun</option><option>Côte d'Ivoire</option></select></div>
      <div class="row" style="justify-content:flex-start"><input id="terms" class="check" type="checkbox"><span>J’accepte les <span class="link">conditions d’utilisation</span> et la <span class="link">politique de confidentialité</span>.</span></div>
      <div id="reg-message" class="message"></div>
      <button class="btn dark" id="register-btn">Créer mon compte &nbsp; →</button>
      <div class="or"><span class="divider"></span>OU<span class="divider"></span></div>
      <button class="btn outline google" id="google-register"><span class="google-letter">G</span> S’inscrire avec Google</button>
    </section>
    <p class="small">Vous avez déjà un compte ? <span class="link" data-nav="login">Se connecter</span></p>
  `);
  bindCommon();
  toggle("#reg-eye", "#reg-password"); toggle("#reg-eye2", "#reg-confirm");
  document.querySelector("#register-btn")?.addEventListener("click", () => {
    const email = (document.querySelector("#reg-email") as HTMLInputElement).value;
    const password = (document.querySelector("#reg-password") as HTMLInputElement).value;
    const confirm = (document.querySelector("#reg-confirm") as HTMLInputElement).value;
    const country = (document.querySelector("#country") as HTMLSelectElement).value;
    const terms = (document.querySelector("#terms") as HTMLInputElement).checked;
    if (!email || !password || !confirm || !country) return setMessage("reg-message", "Veuillez remplir tous les champs.");
    if (password.length < 6) return setMessage("reg-message", "Le mot de passe doit contenir au moins 6 caractères.");
    if (password !== confirm) return setMessage("reg-message", "Les mots de passe ne correspondent pas.");
    if (!terms) return setMessage("reg-message", "Vous devez accepter les conditions.");
    try { register(email,password,country); login(email,password); screen="profile"; render(); }
    catch(e) { setMessage("reg-message",e); }
  });
  document.querySelector("#google-register")?.addEventListener("click", () => setMessage("reg-message","La création Google nécessite la configuration OAuth.",true));
}

function renderForgot() {
  shell(`
    ${backButton("login")}
    ${logo()}
    <h1 class="subtitle" style="font-size:clamp(30px,8vw,50px)">Mot de passe oublié ?</h1>
    <p class="description">Entrez l’adresse e-mail associée<br>à votre compte.</p>
    <div style="width:100%;max-width:700px">
      <div class="field"><span class="icon">✉</span><input id="forgot-email" type="email" placeholder="Adresse e-mail"></div>
      <div id="forgot-message" class="message"></div>
      <button class="btn primary" id="send-code">➤ &nbsp; Envoyer le code</button>
      <p class="small link" data-nav="login" style="margin-top:28px">Retour à la connexion</p>
    </div>
  `);
  bindCommon();
  document.querySelector("#send-code")?.addEventListener("click", () => {
    const email = (document.querySelector("#forgot-email") as HTMLInputElement).value;
    try {
      const code = createRecoveryCode(email);
      recoveryEmail = email;
      screen = "verify"; render();
      console.info("Code de récupération de démonstration :", code);
    } catch(e) { setMessage("forgot-message",e); }
  });
}

function renderVerify() {
  shell(`
    ${backButton("forgot")}
    <div style="font-size:105px;margin-top:25px">🛡️</div>
    <h1 class="subtitle" style="font-size:clamp(28px,7vw,46px)">Confirmation du code<br>de récupération reçu</h1>
    <p class="description">Entrez le code de récupération que vous avez reçu<br>par e-mail afin de vérifier votre identité<br>et de sécuriser votre compte.</p>
    <div style="width:100%;max-width:700px">
      <div class="code-grid">${[0,1,2,3,4,5].map(i=>`<input id="code-${i}" inputmode="numeric" maxlength="1" aria-label="Chiffre ${i+1}">`).join("")}</div>
      <p class="small">Le code est composé de 6 chiffres.</p>
      <div id="verify-message" class="message"></div>
      <button class="btn primary" id="verify-btn">Vérifier le code</button>
      <p class="small link" id="resend">Renvoyer le code</p>
    </div>
  `);
  bindCommon();
  const boxes = [...document.querySelectorAll<HTMLInputElement>(".code-grid input")];
  boxes.forEach((box,i)=>{
    box.addEventListener("input",()=>{ box.value=box.value.replace(/\D/g,""); if(box.value && i<5) boxes[i+1].focus(); });
    box.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!box.value&&i>0) boxes[i-1].focus();});
  });
  document.querySelector("#verify-btn")?.addEventListener("click",()=>{
    const code=boxes.map(b=>b.value).join("");
    if(code.length!==6) return setMessage("verify-message","Entrez les 6 chiffres du code.");
    if(!verifyRecoveryCode(recoveryEmail,code)) return setMessage("verify-message","Code incorrect ou expiré.");
    screen="profile"; render();
  });
  document.querySelector("#resend")?.addEventListener("click",()=>{
    try { const code=createRecoveryCode(recoveryEmail); console.info("Nouveau code de démonstration :",code); setMessage("verify-message","Un nouveau code a été généré. Consultez la console en mode développement.",true); }
    catch(e){setMessage("verify-message",e);}
  });
}

function renderProfile() {
  shell(`
    <div style="width:100%;display:flex;justify-content:space-between;margin-top:25px"><span class="back" data-nav="login">←</span><span class="back">⚙</span></div>
    <h1 class="subtitle" style="font-size:clamp(30px,8vw,48px);margin-top:90px">Choisissez votre profil</h1>
    <p class="description">Pour continuer, sélectionnez le type de compte<br>que vous souhaitez créer.</p>
    <div style="width:100%;max-width:760px">
      <div class="profile-card" data-profile="participant"><div class="profile-icon">👤</div><div class="profile-text"><h2>Participant</h2><p>Je souhaite acheter des tickets, participer à des événements et vivre des expériences uniques.</p></div><div class="radio"></div></div>
      <div class="profile-card" data-profile="organisateur"><div class="profile-icon">▣</div><div class="profile-text"><h2>Organisateur</h2><p>Je souhaite créer et gérer mes événements, mettre en vente des tickets et toucher mon public.</p></div><div class="radio"></div></div>
      <div class="later" id="later">Plus tard</div>
    </div>
  `);
  bindCommon();
  document.querySelectorAll<HTMLElement>("[data-profile]").forEach(card=>{
    card.addEventListener("click",()=>{
      selectedProfile=card.dataset.profile as "participant"|"organisateur";
      document.querySelectorAll(".profile-card").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      setProfile(selectedProfile);
      setTimeout(()=>console.info("Profil sélectionné :",selectedProfile),120);
    });
  });
  document.querySelector("#later")?.addEventListener("click",()=>logout());
}

function bindCommon() {
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach(el=>{
    el.addEventListener("click",()=>{screen=el.dataset.nav as Screen;render();});
  });
}

function toggle(buttonSelector:string,inputSelector:string){
  document.querySelector(buttonSelector)?.addEventListener("click",()=>{
    const input=document.querySelector(inputSelector) as HTMLInputElement;
    input.type=input.type==="password"?"text":"password";
  });
}

function setMessage(id:string,error:unknown,success=false){
  const el=document.querySelector(`#${id}`);
  if(!el)return;
  el.className=`message ${success?"success":"error"}`;
  el.textContent=error instanceof Error?error.message:String(error);
}

render();
