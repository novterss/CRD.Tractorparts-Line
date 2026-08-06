export function createQuotationFlex(cart) {
  const subtotal = cart.total;
  const vat = Math.round(subtotal * 0.07);
  const grandTotal = subtotal + vat;
  const dateStr = new Date().toLocaleDateString('th-TH');
  const quoteId = `QT${Math.floor(Math.random() * 1000000)}`;

  const itemBoxes = cart.items.map(item => ({
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        type: 'text',
        text: item,
        size: 'sm',
        color: '#555555',
        flex: 0,
        wrap: true,
        weight: 'bold'
      }
    ]
  }));

  return {
    type: 'flex',
    altText: 'ใบเสนอราคาจาก CRD Tractor Parts',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'RECEIPT / QUOTATION',
            weight: 'bold',
            color: '#1DB446',
            size: 'sm'
          },
          {
            type: 'text',
            text: 'CRD Tractor Parts',
            weight: 'bold',
            size: 'xxl',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'เซียงกงรังสิต (ศูนย์เก่า)',
            size: 'xs',
            color: '#aaaaaa',
            wrap: true
          },
          {
            type: 'separator',
            margin: 'xxl'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xxl',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'เลขที่ (No):', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: quoteId, size: 'sm', color: '#111111', align: 'end' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วันที่ (Date):', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: dateStr, size: 'sm', color: '#111111', align: 'end' }
                ]
              }
            ]
          },
          {
            type: 'separator',
            margin: 'xxl'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xxl',
            spacing: 'sm',
            contents: [
              ...itemBoxes
            ]
          },
          {
            type: 'separator',
            margin: 'xxl'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xxl',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ยอดรวม (Subtotal)', size: 'sm', color: '#555555' },
                  { type: 'text', text: `฿${subtotal.toLocaleString()}`, size: 'sm', color: '#111111', align: 'end' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ภาษี (VAT 7%)', size: 'sm', color: '#555555' },
                  { type: 'text', text: `฿${vat.toLocaleString()}`, size: 'sm', color: '#111111', align: 'end' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ยอดสุทธิ (Total)', size: 'lg', color: '#d32f2f', weight: 'bold' },
                  { type: 'text', text: `฿${grandTotal.toLocaleString()}`, size: 'lg', color: '#d32f2f', weight: 'bold', align: 'end' }
                ]
              }
            ]
          }
        ]
      },
      styles: {
        footer: { separator: true }
      }
    }
  };
}
