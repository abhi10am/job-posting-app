import Card from 'components/Card'
import PageTitle from 'components/PageTitle'
import Button from 'components/form/Button'
import Input from 'components/form/Input'
import InputLabel from 'components/form/InputLabel'
import MasterLayout from 'components/layout/MasterLayout'
import React from 'react'

const EditJobPost = () => {
  return (
    <MasterLayout>
      <div className="flex items-center justify-between mb-8">
        <PageTitle>Post New Job</PageTitle>
      </div>

      <Card>
        <form className="space-y-4 md:space-y-6" action="#">
          <div>
            <InputLabel htmlFor="title">Job Title</InputLabel>
            <Input type="text" name="title" id="title" placeholder="e.g. ReactJS Developer" required />
          </div>

          <div>
            <InputLabel htmlFor="company-name">Company Name</InputLabel>
            <Input type="text" name="company-name" id="company-name" placeholder="XYZ Technologies" required />
          </div>

          <div>
            <InputLabel htmlFor="tags">Tags</InputLabel>
            <Input type="text" name="tags" id="tags" placeholder="" required />
          </div>

          <div>
            <InputLabel htmlFor="skills">Skills Required</InputLabel>
            <Input type="text" name="skills" id="skills" placeholder="" required />
          </div>

          <div>
            <InputLabel htmlFor="experience-required">Experience Required</InputLabel>
            <Input type="text" name="experience-required" id="experience-required" placeholder="" required />
          </div>

          <div>
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input type="text" name="description" id="description" placeholder="" />
          </div>

          <div>
            <InputLabel htmlFor="salary">Salary</InputLabel>
            <Input type="text" name="salary" id="salary" placeholder="" />
          </div>

          <div>
            <InputLabel htmlFor="additional-details">Additional Details</InputLabel>
            <Input type="text" name="additional-details" id="additional-details" placeholder="" />
          </div>

          <Button type="submit">Submit Job Post</Button>
        </form>
      </Card>
    </MasterLayout>
  )
}

export default EditJobPost
