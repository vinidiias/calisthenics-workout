import { atom, useAtom } from "jotai";
import { useEffect } from "react";

// Função para recuperar o estado inicial do tema
const getInitialTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "true"; // Garante que retorna um booleano válido
  } catch (error) {
    console.error("Erro ao recuperar tema:", error);
    return false;
  }
};

const dark = atom(getInitialTheme());

export const useThemeColor = () => {
  const [isDark, setIsDark] = useAtom(dark);

  useEffect(() => {
    localStorage.setItem("theme", isDark); // Salva diretamente como string "true" ou "false"
  }, [isDark]);

  const handleClick = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, handleClick };
};
