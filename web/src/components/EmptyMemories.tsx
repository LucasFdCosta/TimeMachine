export const EmptyMemories = () => {
  return (
    <div className='flex flex-1 p-16 items-center justify-center'>
      <p className='text-center leading-relaxed w-[360px]'>
        Você ainda não resgistrou nenhuma lembrança, comece a {" "}
        <a href="" className='underline hover:text-gray-50'>
          criar agora
        </a>
      </p>
    </div>
  )
}