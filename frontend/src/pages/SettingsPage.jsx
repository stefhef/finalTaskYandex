import { useEffect } from "react";

const SettingsPage = () => {
    useEffect(() => {
        document.title = "Настройки";
    }, []);
    return (
        <div>
            <h1>Settings</h1>
            <p>Не должно работать</p>
        </div>
    )
}

export default SettingsPage;