import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, provider } from "./firebase";

export const githubLogin = async () => {
  const result = await signInWithPopup(auth, provider);

  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) throw new Error("No GitHub token");

  localStorage.setItem("github_token", token);

  return result.user;
};