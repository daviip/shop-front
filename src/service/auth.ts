type Props = {
  email: string;
  password: string;
};

const register = async (props: Props) => {
  const response = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
  });

  const data = await response.json();

  return data;
};

const login = async (props: Props) => {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
  });

  const data = await response.json();

  return data;
};

const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
    body: JSON.stringify({
      refresh_token: "refresh_token",
    }),
  });

  const data = await response.json();

  return data;
};

export { login, register, logout };
