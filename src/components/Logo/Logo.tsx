import { FC } from "react"

interface IProps {
    logo: string
}

export const Logo:FC<IProps> = ({ logo }) => {
    return (
        <img src={logo} alt='logo'/>
    )
}