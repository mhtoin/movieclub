import prisma from '@/lib/prisma'

const createSiteConfig = async () => {
  await prisma.siteConfig.create({
    data: {
      watchProviders: [
        {
          display_priority: 5,
          logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
          provider_name: 'Netflix',
          provider_id: 8,
        },
        {
          display_priority: 4,
          logo_path: '/nrORhu39C2YjBhx9v8rU8oFlulj.jpg',
          provider_name: 'Yle Areena',
          provider_id: 323,
        },
        {
          display_priority: 24,
          logo_path: '/w1V9hzBaRlkpISBWhCv676kI8Mp.jpg',
          provider_name: 'Cineasterna',
          provider_id: 496,
        },
      ],
      watchWeekDay: 'wednesday',
    },
  })
}

createSiteConfig()
