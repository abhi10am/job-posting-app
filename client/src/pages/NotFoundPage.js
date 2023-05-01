import CustomLink from 'components/CustomLink'
import Button from 'components/form/Button'
import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="space-y-4 text-center">
        <div className="text-lg">404 Error</div>
        <CustomLink to="/login" className="block"><Button variant="primary">Go back to login</Button></CustomLink>
      </div>
    </div>
  )
}

export default NotFoundPage
