export function createTrackingFlex(trackingNo) {
  return {
    type: 'flex',
    altText: 'สถานะการจัดส่งพัสดุ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'xl',
        contents: [
          {
            type: 'text',
            text: '📦 สถานะการจัดส่ง',
            weight: 'bold',
            size: 'xl',
            color: '#1DB446'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: 'ออเดอร์ของคุณได้รับการจัดส่งเรียบร้อยแล้ว',
                wrap: true,
                color: '#555555',
                size: 'sm'
              },
              {
                type: 'text',
                text: 'บริษัทขนส่ง: Kerry Express',
                weight: 'bold',
                color: '#111111',
                size: 'sm',
                margin: 'md'
              },
              {
                type: 'text',
                text: `เลขพัสดุ: ${trackingNo}`,
                weight: 'bold',
                color: '#d32f2f',
                size: 'lg',
                margin: 'sm'
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#1DB446',
            action: {
              type: 'uri',
              label: 'เช็คพัสดุ Kerry',
              uri: `https://th.kex-express.com/th/track/?track=${trackingNo}`
            }
          }
        ]
      }
    }
  };
}
