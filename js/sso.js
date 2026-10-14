/* Login pelo SET SSO. Sem backend: Authorization Code + PKCE feito pelo navegador. */
window.SSO = (function () {
  const BASE = location.origin + "/";
  const sso = new oidc.UserManager({
    authority: "https://sso.idt.org.br",
    client_id: "set_processos",
    redirect_uri: BASE,
    post_logout_redirect_uri: BASE,
    response_type: "code",
    scope: "openid profile email",
    userStore: new oidc.WebStorageStateStore({ store: window.sessionStorage }),
  });

  async function exigirLogin() {
    const url = new URL(location.href);

    if (url.searchParams.has("code") || url.searchParams.has("error")) {
      try {
        const user = await sso.signinRedirectCallback();
        history.replaceState(null, "", url.pathname + (user.state || ""));
        return user;
      } catch (e) {
        history.replaceState(null, "", url.pathname);
        if (e && e.error === "access_denied") return semAcesso();
        throw e;
      }
    }

    const user = await sso.getUser();
    if (user) return user;

    await sso.signinRedirect({ state: location.hash });
    return null;
  }

  function semAcesso() {
    document.body.innerHTML =
      '<main class="sso-bloqueio">' +
      "<h1>Sem acesso</h1><p>Sua conta não tem acesso a este sistema. " +
      "Fale com o administrador.</p><p><a href=\"https://sso.idt.org.br/conta\">Meus sistemas</a></p></main>";
    return null;
  }

  function sair() {
    return sso.signoutRedirect();
  }

  return { exigirLogin, sair };
})();
