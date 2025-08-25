import { Field } from "@/utils/types/interfaces";

export function RegisterField(): Field[] {
  return [
    {
      id: 0,
      type: "MAIL",
      name: "email",
      label: "Correo",
      placeholder: "example@mercadosliz.com",
      require: true,
    },
    {
      id: 1,
      type: "PASSWORD",
      name: "password",
      label: "Contraseña",
      placeholder: "UseExample@123",
      require: true,
    },
    {
      id: 3,
      type: "SELECT",
      name: "remember_me",
      label: "Recuerdame",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "entrenador", label: "Entrenador" },
        { value: "cliente", label: "Cliente" },
      ],
      require: false,
    },
  ];
}
