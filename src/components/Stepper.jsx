import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

class CustomStepper extends React.PureComponent {
    state = {
        activeStep : 0,
        skipped:new Set(),
    }
    isStepOptional = (step) => {
        return step === 1;
      };
    
      isStepSkipped = (step) => {
        const { skipped } = this.state
        return skipped.has(step);
      };
      handleCancel= () => {
        this.setState( prev => ({activeStep: 0}))

      };
      handleNext = () => {
        const { activeStep, skipped } = this.state
        let newSkipped = skipped;
        if (this.isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
    
        this.setState( prev => ({activeStep: prev.activeStep + 1}))
        this.setState( prev => ({skipped: newSkipped}))

      };
    
      handleBack = () => {
        this.setState( prev => ({activeStep: prev.activeStep - 1}))
      };
    
      handleSkip = () => {
        const { activeStep } = this.state
        if (!this.isStepOptional(activeStep)) {
          // You probably want to guard against something like this,
          // it should never occur unless someone's actively trying to break something.
          throw new Error("You can't skip a step that isn't optional.");
        }
    
        this.setState( prev => ({activeStep: prev.activeStep + 1}))
        this.setState( prev => {
            const newSkipped = new Set(prev.skipped.values());
            newSkipped.add(prev.activeStep);
            return newSkipped;
          })

      };
    
      render(){
        const { isStepOptional, isStepSkipped, handleNext, handleSkip, handleBack, handleCancel} = this
        const { activeStep } = this.state
        const { handleSubmit, steps, contents } = this.props
        return (<Box sx={{ width: '100%'}}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => { 
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', pt: 4} }>
                <Typography sx={{fontSize:'20px'}}>Click the Submit button to create user or cancel to go back</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, gap:2,pr:10 }}>
            <Box sx={{ flex: '1 1 auto' }} />
                <Button variant='contained' color='warning' onClick={ handleCancel}>Cancel</Button>
                <Button variant='contained' color='success' onClick={ handleSubmit }>Submit</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* steppers content */}
            <Box sx={{display:"flex",pt:5, p:5, minHeight: '100%',gap:1}}>
                {contents[activeStep]}
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2,p:5 }}>
            <Button 
                variant='contained' 
                color='warning'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {isStepOptional(activeStep) && (
               <Button variant='contained' color='primary' onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
  
              <Button 
                variant='contained' 
                color='success'  
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit': 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>);
      }
}
// Prop Types
CustomStepper.propTypes = {
    dispatch: PropTypes.func,

}

CustomStepper.defaultProps = {
  dispatch: () => null,
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CustomStepper)
