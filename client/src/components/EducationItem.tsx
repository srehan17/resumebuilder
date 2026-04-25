type Props = {
    item: {
        _id?: string
        institution: string
        qualification: string
        gpa?: string
        startYear: string
        endYear?: string
    }
}

const EducationItem = ({ item }: Props) => {
    return (
        <>
            <td>{item.institution}</td>
            <td>{item.qualification}</td>
            <td>{item.gpa}</td>
            <td>{item.startYear}</td>
            <td>{item.endYear}</td>
        </>
    )
}

export default EducationItem
