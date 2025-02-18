import { useExtendOverlay } from '@overlastic/react'
import { Button, Modal, Spin } from 'antd'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { noop } from '@/utils'
import { Order } from '@/api/index.type'

export interface CheckoutDialogProps {
  order: Order
}

export function CheckoutDialog(props: CheckoutDialogProps) {
  const { visible, reject } = useExtendOverlay({
    duration: 300,
  })
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  const {
    value: stripe = null,
    loading,
  } = useAsync(() => loadStripe(publishableKey), [])
  return (
    <Modal
      onCancel={reject}
      title="Checkout"
      open={visible}
      footer={noop}
      centered
    >
      <Spin spinning={loading}>
        <Elements
          stripe={stripe}
          options={{
            clientSecret: props.order.secret,
            appearance: { theme: 'flat', variables: { colorText: '#1f1f1f' } },
          }}
        >
          <CheckoutForm url={`${location.origin}/submitted?number=${props.order.id}`} />
        </Elements>
      </Spin>
    </Modal>
  )
}

interface CheckoutFormProps {
  url: string
}

function CheckoutForm(props: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(event: any) {
    event.preventDefault()
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const { error } = await stripe.confirmPayment({
      // `Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: props.url,
      },
    })
    if (error)
      setErrorMessage(error.message)
  }

  return (
    <form>
      <PaymentElement className="min-h-250px" />
      {/* Show error message to your customers */}
      {errorMessage && <div className="text-red-5 text-12px">{errorMessage}</div>}
      <div className="flex justify-end">
        <Button size="large" type="primary" onClick={onSubmit} disabled={!stripe}>
          Submit
        </Button>
      </div>
    </form>
  )
}
