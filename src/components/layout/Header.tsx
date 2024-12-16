import { Menu } from "./Menu";

export const Header = () => {
  return (
    <header className="py-6 bg-[#1A2A1D]">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#EDEDDD]">AI Ice Breaker Generator</h1>
        <Menu />
      </div>
    </header>
  );
};