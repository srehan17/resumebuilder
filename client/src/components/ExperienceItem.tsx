type Props = {
    item: {
        _id?: string
        company: string
        position: string
        responsibilities?: string
        startYear: string
        endYear?: string
    }
}

const ExperienceItem = ({ item }: Props) => {
    return (
        <>
            <td>{item.company}</td>
            <td>{item.position}</td>
            <td>{item.responsibilities}</td>
            <td>{item.startYear}</td>
            <td>{item.endYear}</td>
        </>
    )
}

export default ExperienceItem
