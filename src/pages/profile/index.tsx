import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IoPersonCircle } from 'react-icons/io5'

import { useFileSelect } from '@/modules/user/hooks/useFileSelect'
import { UserProfileInputSchema, type UserProfileInput } from '@/modules/user/model'
import { useProfileStore } from '@/modules/user/store'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { Spinner } from '@/components/Spinner'
import { ROUTES } from '@/lib/constants'
import { api } from '@/utils/api'

export default function Profile() {
  const userProfile = useProfileStore(state => state.info)
  const updateProfile = useProfileStore(state => state.updateProfile)

  const updateProfileMutation = api.users.updateUserProfile.useMutation({
    onSuccess(response) {
      updateProfile(response)
    },
  })

  const updateProfileImageMutation = api.users.updateUserProfile.useMutation({
    onSuccess(response) {
      updateProfile(response)
    },
  })

  const { fileString, getInputProps, getRootProps } = useFileSelect({
    onFileSelect(fileString) {
      updateProfileImageMutation.mutate({ image: fileString })
    },
  })

  const formDefaultValues = React.useMemo(
    () => ({
      username: userProfile?.username ?? '',
      name: userProfile?.name ?? '',
    }),
    [userProfile?.username, userProfile?.name]
  )

  const { register, handleSubmit, reset } = useForm<UserProfileInput>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(UserProfileInputSchema),
  })

  React.useEffect(() => {
    reset(formDefaultValues)
  }, [formDefaultValues, reset])

  return (
    <div className="container grid grid-cols-1 grid-rows-layout">
      <section className="mt-24 flex items-start justify-center">
        <div className="sm:shadow-profile max-w-md flex-1 rounded-lg bg-white px-4 pt-6 pb-12 sm:px-8">
          <h1 className="text-center text-3xl font-semibold text-slate-700">
            Your Profile
          </h1>

          <form
            className="mt-12"
            onSubmit={handleSubmit(values => updateProfileMutation.mutate(values))}
          >
            <div className="mb-10 flex flex-col items-center">
              <div {...getRootProps()}>
                <input
                  {...getInputProps({ disabled: updateProfileMutation.isLoading })}
                />

                <div
                  className={cn(
                    'relative block h-40 w-40 cursor-pointer rounded-full bg-gray-100',
                    updateProfileImageMutation.isLoading ? 'cursor-not-allowed' : ''
                  )}
                >
                  {userProfile?.image || fileString ? (
                    <Image
                      src={(userProfile?.image || fileString) ?? ''}
                      className="h-full w-full rounded-full object-cover"
                      width={160}
                      height={160}
                      alt="profile picture"
                    />
                  ) : (
                    <IoPersonCircle className="h-full w-full" />
                  )}

                  {updateProfileImageMutation.isLoading && (
                    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
                      <Spinner className="h-9 w-9" />
                    </div>
                  )}

                  {!updateProfileImageMutation.isLoading && (
                    <p className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-sm text-white/0  transition-colors hover:bg-black/50 hover:text-white">
                      {userProfile?.image ? 'Edit' : 'Upload'}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs font-normal text-slate-500">
                Click on the box above to {userProfile?.image ? 'edit' : 'upload'} your
                profile picture
              </p>
            </div>

            <Input
              {...register('username')}
              label="Username"
              containerClassName="mb-4"
              id="username"
            />

            <Input
              {...register('name')}
              label="Name"
              containerClassName="mb-4"
              id="name"
            />

            <div className="mt-8 flex items-center gap-2">
              <Link
                href={ROUTES.home}
                className="w-full rounded-md border border-slate-200 bg-transparent py-3 text-center text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus:ring-slate-700"
              >
                Back
              </Link>

              <Button
                className="w-full rounded-md py-3 text-sm"
                loading={updateProfileMutation.isLoading}
                type="submit"
                variant="primary"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

Profile.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>
