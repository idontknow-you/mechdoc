const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  tool: <><path d="m14 6 4 4m-3-7a6 6 0 0 0-7 8L3 16a3 3 0 0 0 4 4l5-5a6 6 0 0 0 8-7l-4 4-4-4 4-4Z" /></>,
  report: <><path d="M14 3H5v18h14V8Z" /><path d="M14 3v5h5M8 12h8M8 16h5" /></>,
  flow: <><rect x="8" y="2" width="8" height="5" rx="1" /><rect x="2" y="17" width="8" height="5" rx="1" /><rect x="14" y="17" width="8" height="5" rx="1" /><path d="M12 7v5M6 17v-5h12v5" /></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v1" /></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
  refresh: <><path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5" /></>,
  print: <><path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v7H6ZM17 11h1" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  alert: <><path d="m12 3 10 18H2Z" /><path d="M12 9v5M12 17v1" /></>,
  motor: <><rect x="5" y="6" width="14" height="12" rx="3" /><path d="M2 10h3m14 0h3M2 14h3m14 0h3M8 3v3m8-3v3M8 18v3m8-3v3m-7-9h6m-6-3h6m-6 6h6" /></>,
  pump: <><circle cx="12" cy="12" r="6" /><path d="M6 12H2V5h7M18 12h4v7h-7M12 8l3 4-3 4-3-4Z" /></>,
  gear: <><path d="m9 3-1 3-3 1-2 4 2 2-1 3 3 3 3-1 2 3 4-1 1-3 3-1 1-4-3-2 1-3-3-3-3 1Z" /><circle cx="12" cy="12" r="3" /></>,
  conveyor: <><rect x="2" y="8" width="20" height="9" rx="4.5" /><circle cx="7" cy="12.5" r="1.5" /><circle cx="17" cy="12.5" r="1.5" /><path d="M6 17v4m12-4v4M9 5h6" /></>,
  temperature: <><path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Z" /><path d="M12 8v10" /></>,
  pulse: <path d="M2 12h4l3-8 5 16 3-8h5" />,
  speed: <><path d="M4 18a10 10 0 1 1 16 0M8 18h8M12 14l5-7" /><circle cx="12" cy="14" r="1" /></>,
  spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};
export default function Icon({ name = "info", size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.info}</svg>;
}
export const machineIcons = { electric_motor: "motor", water_pump: "pump", gearbox: "gear", conveyor_belt: "conveyor" };
