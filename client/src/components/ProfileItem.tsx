type Props = {
    item: {
        _id?: string
        name: string
        phone: string
        email?: string
        location?: string
        linkedIn?: string
    }
}

const ProfileItem = ({ item }: Props) => {
    return (
        <>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{item.email}</td>
            <td>{item.location}</td>
            <td>{item.linkedIn}</td>
        </>
    )
}

export default ProfileItem
