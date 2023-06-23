<template>
  <q-card class="bg-dark" :style="{'width':this.store.avatarActive ? '50%' : '100%'}" style="margin:5% auto;">
    <q-card-section horizontal >
      <q-card-section class="col text-center">
        <google-pay-button
          environment="TEST"
          :button-type="buttonType"
          :button-size-mode="isCustomSize ? 'fill' : 'static'"
          :paymentRequest.prop="paymentRequest"
          @loadpaymentdata="onLoadPaymentData"
          v-bind:onPaymentAuthorized.prop="onPaymentDataAuthorized"
          @error="onError"
          :style="{ width: `${buttonWidth}px`, height: `${buttonHeight}px` }"
        ></google-pay-button>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import '@google-pay/button-element';
import { useCounterStore } from 'src/stores/store';
export default {
  name:'Google Pay',
  props:[],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      buttonType: 'buy',
    isCustomSize: false,
    buttonWidth: 240,
    buttonHeight: 40,
    isTop: window === window.top,

    paymentRequest: {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '1.00',
        currencyCode: 'USD',
        countryCode: 'US',
      },
      callbackIntents:['PAYMENT_AUTHORIZATION']
    },
    }
  },
  methods:{
    onLoadPaymentData: (event) => {
      console.log('load payment data', event.detail);
    },
    onError: (event) => {
     // console.error('error', event.error);
    },
    onPaymentDataAuthorized:paymentData => {
      console.log('payment authorized',paymentData)
      return{
        transactionState : 'SUCCESS'
      }
    }
  }
}
</script>

<style>

</style>
