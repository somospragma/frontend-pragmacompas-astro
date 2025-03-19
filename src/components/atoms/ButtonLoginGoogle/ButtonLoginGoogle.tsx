import { signIn } from "auth-astro/client";
export const ButtonLoginGoogle = () => {
  return (
    <button
      onClick={() => {
        signIn("google");
      }}
      // eslint-disable-next-line max-len
      className="text-primary-indigo-50 px-8 py-2 border bg-primary-purple-500 bg-opacity-25 border-primary-purple-500 border-solid rounded-[50px] shadow-2xl flex gap-2 hover:shadow-xl hover:bg-opacity-100 hover:border-opacity-100"
    >
      <img src="https://mapadecrecimiento.pragma.com.co/assets/icons/icon-google.svg" alt="Google Icon" />
      Inicia sesión con Google
    </button>
  );
};
