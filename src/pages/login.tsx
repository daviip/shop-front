import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { Button } from "@/components/Button";
import { login as loginAuth, register as registerAuth } from "@/service/auth";

type Form = {
  emailLogin?: string;
  passwordLogin?: string;
  emailRegister?: string;
  passwordRegister?: string;
  password2Register?: string;
};

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({});

  const onSubmitRegister = async (formData: Form) => {
    if (formData.passwordRegister === formData.password2Register) {
      const responseRegister = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.emailRegister,
          password: formData.passwordRegister,
        }),
      });

      const dataRegister = await registerAuth({
        email: formData.emailLogin ?? "",
        password: formData.passwordLogin ?? "",
      });

      if (!dataRegister.ok) {
        setError("passwordRegister", {
          message: "El registro no se ha podido completar",
        });
        return;
      }

      const dataLogin = await loginAuth({
        email: formData.emailLogin ?? "",
        password: formData.passwordLogin ?? "",
      });

      setCookie("token", dataLogin.token);
      setCookie("user", dataLogin.user);

      router.push("/");
    } else {
      setError("passwordRegister", { message: "Las contraseñas no coinciden" });
    }
  };

  const onSubmitLogin = async (formData: Form) => {
    const data = await loginAuth({
      email: formData.emailLogin ?? "",
      password: formData.passwordLogin ?? "",
    });

    if (!data.ok) {
      setError("passwordLogin", {
        message: "No se ha podido iniciar sesión",
      });
      return;
    }

    setCookie("token", data.token);
    setCookie("user", data.id);

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl w-full p-8 border-gray-700 rounded-lg shadow-2xl gap-4 lg:gap-0">
        <form
          className="bg-red-500 flex flex-col items-center gap-6 rounded-lg p-4 lg:rounded-r-none"
          onSubmit={handleSubmit(onSubmitLogin)}
        >
          <p className="text-center text-3xl">Iniciar sesión</p>
          <input
            type="text"
            {...register("emailLogin")}
            className="h-8 w-full lg:w-80 border-2 rounded-lg"
          />
          <input
            type="password"
            {...register("passwordLogin")}
            className="h-8 w-full lg:w-80 border-2 rounded-lg"
          />
          {errors.emailLogin?.message ?? errors.passwordLogin?.message}
          <Button type="submit">Iniciar sesión</Button>
        </form>
        <form
          className="bg-green-500 flex flex-col items-center gap-6 rounded-lg p-4 lg:rounded-l-none"
          onSubmit={handleSubmit(onSubmitRegister)}
        >
          <p className="text-center text-3xl">Registro</p>
          <input
            type="text"
            {...register("emailRegister")}
            className="h-8 w-full lg:w-80 border-2 rounded-lg"
          />
          <input
            type="password"
            {...register("passwordRegister")}
            className="h-8 w-full lg:w-80 border-2 rounded-lg"
          />
          <input
            type="password"
            {...register("password2Register")}
            className="h-8 w-full lg:w-80 border-2 rounded-lg"
          />
          {errors.passwordRegister?.message}
          <Button type="submit">Registrarse</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
