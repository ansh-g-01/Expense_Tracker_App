import { NavLink } from "react-router-dom";

export default function Navbar() {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition";
  const active = "bg-black text-white";
  const inactive = "text-gray-600 hover:bg-gray-100";

  return (
    <nav className="flex gap-2 border-b p-4">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/tags"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        Tags
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        Stats
      </NavLink>
    </nav>
  );
}
