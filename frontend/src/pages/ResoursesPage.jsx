import { useEffect } from "react";

const ResoursesPage = () => {
    useEffect(() => {
        document.title = "Мониторинг";
    }, []);
    return (
        <div>
            <h1>Resourses</h1>
            <p>Не должно работать</p>
        </div>
    )
}

export default ResoursesPage;