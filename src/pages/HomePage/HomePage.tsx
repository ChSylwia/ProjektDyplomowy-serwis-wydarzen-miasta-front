const HomePage = () => {
  return (
    <div>
      <p>
        A starter template that use React, Tailwind CSS + Daisy UI, Typescript, React Router and
        another pre-configuration
      </p>
      <div className='card card-side bg-base-100 shadow-xl'>
        <figure>
          <img
            src='https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp'
            alt='Movie'
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>New movie is released!</h2>
          <p>Click the button to watch on Jetflix app.</p>
          <div className='card-actions justify-end'>
            <button className='btn btn-primary'>Watch</button>
          </div>
        </div>
      </div>
      <div className='card bg-base-100 w-96 shadow-xl'>
        <figure>
          <img
            src='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
            alt='Shoes'
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className='card-actions justify-end'>
            <button className='btn btn-primary'>Buy Now</button>
          </div>
        </div>
      </div>
      <div className='card bg-base-100 w-96 shadow-xl'>
        <figure>
          <img
            src='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
            alt='Shoes'
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className='card-actions justify-end'>
            <button className='btn btn-primary'>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
