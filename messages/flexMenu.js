export function createProductCatalog(baseUrl = '') {
  const imageUrl1 = baseUrl ? `${baseUrl}/public/S0068.jpg` : 'https://images.unsplash.com/photo-1616238383804-0c58e733075d?auto=format&fit=crop&q=80&w=800&h=533';
  const imageUrl2 = baseUrl ? `${baseUrl}/public/S0070.jpg` : 'https://images.unsplash.com/photo-1587829462796-03714f3aebcb?auto=format&fit=crop&q=80&w=800&h=533';

  return {
    type: 'flex',
    altText: 'แคตตาล็อกสินค้า CRD Tractor Parts',
    contents: {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: imageUrl1,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'อะไหล่คุณภาพพรีเมียม',
                weight: 'bold',
                size: 'xl'
              },
              {
                type: 'text',
                text: '฿1,200',
                size: 'xl',
                color: '#ff5551',
                weight: 'bold'
              },
              {
                type: 'text',
                text: 'อะไหล่รถไถคุณภาพสูง ใช้งานทนทาน',
                wrap: true,
                color: '#aaaaaa',
                size: 'sm',
                margin: 'md'
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
                color: '#ff5551',
                action: {
                  type: 'postback',
                  label: 'ดูรายละเอียด',
                  data: 'action=detail&item=oil'
                }
              },
              {
                type: 'button',
                style: 'secondary',
                action: {
                  type: 'postback',
                  label: '🛒 หยิบใส่ตะกร้า',
                  data: 'action=buy&item=oil&price=1200'
                }
              }
            ]
          }
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: imageUrl2,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'ชุดลูกกลิ้งและแทร็ก',
                weight: 'bold',
                size: 'xl'
              },
              {
                type: 'text',
                text: '฿850',
                size: 'xl',
                color: '#ff5551',
                weight: 'bold'
              },
              {
                type: 'text',
                text: 'ทนงานหนัก เหมาะกับทุกสภาพดิน',
                wrap: true,
                color: '#aaaaaa',
                size: 'sm',
                margin: 'md'
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
                color: '#ff5551',
                action: {
                  type: 'postback',
                  label: 'ดูรายละเอียด',
                  data: 'action=detail&item=filter'
                }
              },
              {
                type: 'button',
                style: 'secondary',
                action: {
                  type: 'postback',
                  label: '🛒 หยิบใส่ตะกร้า',
                  data: 'action=buy&item=filter&price=850'
                }
              }
            ]
          }
        }
      ]
    }
  };
}
