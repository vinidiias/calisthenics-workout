import { atom, useAtom } from 'jotai'

// Função para recuperar o estado inicial do tema
const getInitialTheme = () => {
    try {
        const storedTheme = localStorage.getItem('theme')
        return storedTheme === "true" // Garante que retorna um booleano válido
    } catch (error) {
        console.error("Erro ao recuperar tema:", error)
        return false
    }
}

const dark = atom(getInitialTheme())

export const useThemeColor = () => {
    const [isDark, setIsDark] = useAtom(dark)

    const handleClick = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        localStorage.setItem('theme', newTheme) // Salva diretamente como string "true" ou "false"
    }

    return { isDark, handleClick }
}