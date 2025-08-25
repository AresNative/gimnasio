import {
  House,
  Clock,
  ClipboardList,
  ChartArea,
  Banknote,
  ListCheck,
  Receipt,
  Truck,
  Info,
  ChartColumnStacked,
  Clock10,
} from "lucide-react";

export const navigationDefault = [
  {
    name: "Pantalla Inicial",
    href: "/",
    icon: House,
  },
  {
    name: "Historia",
    href: "/Historia",
    icon: Clock,
  },
  {
    name: "Informacion",
    href: "/informacion",
    icon: Info,
  },
];
export const navigationUser = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ClipboardList,
  },
];

export const navigationAdmin = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ChartArea,
  },
  {
    name: "Report",
    href: "/report",
    icon: Clock10,
  },
  {
    name: "Checkins",
    href: "/checkins",
    icon: Clock10,
  },
];
