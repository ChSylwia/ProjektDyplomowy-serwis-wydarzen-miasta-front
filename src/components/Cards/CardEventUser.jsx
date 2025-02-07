import { useNavigate } from 'react-router-dom'

function CardEventUser({ item: itemDetails }) {
  const item = itemDetails.event
  const navigate = useNavigate()

  const handleClickRedirect = () => {
    navigate(`/events/details/localEventDetails/${item.id}`, { state: { event: item } })
  }

  const truncateText = (text, wordLimit) => {
    if (!text) return ''
    const words = text.split(' ')
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
  }

  return (
    <div
      key={itemDetails.id}
      className='card bg-tertiary bg-white shadow-xl z-10 h-full flex flex-col min-w-96'
    >
      <figure className='h-48 w-full min-h-52'>
        <img src={item.image} alt={item.title} className='w-full h-full object-cover' />
      </figure>
      <div className='card-body bg-tertiary bg-white flex flex-col h-full'>
        <h2 className='card-title'>{item.title}</h2>
        <p className='flex-grow'>{truncateText(item.description, 10)}</p>
        <div className='card-actions justify-end'>
          <button
            className='btn btn-primary bg-primary text-white hover:bg-primary/90'
            onClick={handleClickRedirect}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardEventUser
