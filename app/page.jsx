import Feed from '@components/Feed';

const Home = () => {
  
  return (
    <section className='w-full flex-center flex-col'>
      <h1 className='head_text text-center'>
        Bark Avenue
        <br className='max-md:hidden' />
        <span className='green_gradient text-center'>
          {' '}
          Dog Adventures
        </span>
      </h1>
      <p className='desc text-center'>
        
      </p>

      <Feed />
    </section>
  );
};

export default Home;
