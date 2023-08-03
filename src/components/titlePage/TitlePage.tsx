import './TitlePage.css'


interface TitlePage {
    title: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TitlePage = (props: TitlePage) => {

    return (
        <div className='container'>
            <h1> {props.title}</h1>
        </div>
    )
}