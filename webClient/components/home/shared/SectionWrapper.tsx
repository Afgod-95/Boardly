import React from 'react'

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id?: string }) => {
  return (
    <section id={id} className="py-10 md:py-18 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            {children}
        </div>
    </section>
     
  )
}

export default SectionWrapper
