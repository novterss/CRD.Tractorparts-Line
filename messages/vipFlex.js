export function createVipCardFlex(points, tier) {
  let cardColor = '#cd7f32'; // Bronze
  let tierText = 'BRONZE MEMBER';
  
  if (tier === 'SILVER') {
    cardColor = '#c0c0c0';
    tierText = 'SILVER MEMBER';
  } else if (tier === 'GOLD') {
    cardColor = '#ffd700';
    tierText = 'GOLD MEMBER';
  }

  return {
    type: 'flex',
    altText: 'บัตรสมาชิก CRD Tractor Parts',
    contents: {
      type: 'bubble',
      styles: {
        header: { backgroundColor: cardColor },
        body: { backgroundColor: '#1a1a1a' }
      },
      header: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'xl',
        contents: [
          {
            type: 'text',
            text: 'CRD VIP CLUB',
            color: '#ffffff',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: tierText,
            color: '#ffffffcc',
            size: 'sm',
            margin: 'sm'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: 'xl',
        contents: [
          {
            type: 'text',
            text: 'คะแนนสะสมของคุณ',
            color: '#aaaaaa',
            size: 'sm'
          },
          {
            type: 'text',
            text: `${points} PTS`,
            color: cardColor,
            weight: 'bold',
            size: '3xl',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'ใช้ 50 แต้ม เพื่อแลกส่วนลด 5%',
            color: '#888888',
            size: 'xs',
            margin: 'lg'
          }
        ]
      }
    }
  };
}
