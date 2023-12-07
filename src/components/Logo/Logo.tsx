import { yariga } from "assets"
import { FC } from "react"

interface IProps {
    logo?: string
}

export const Logo:FC<IProps> = ({ logo = yariga }) => {
    return (
        <img src={logo} alt='logo'/>
    )
}