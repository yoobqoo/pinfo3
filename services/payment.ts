import { supabase } from './supabase';

// 사업자 등록 전이므로 실제 결제 대신 테스트 함수만 남겨둡니다.
export const requestPayment = (
  userEmail: string, 
  userId: string
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    // 실제 결제 로직(PortOne)은 잠시 주석 처리하거나 건너뜁니다.
    // 사업자 등록 후 다시 활성화하면 됩니다.
    
    const isTestMode = true; // 현재 개발 단계

    if (isTestMode) {
      // 테스트 모드: 무조건 성공 처리
      // 실제 앱 배포 전까지만 사용하세요.
      const { error } = await supabase
        .from('profiles')
        .update({ plan_type: 'pro' })
        .eq('id', userId);

      if (error) {
        console.error("Supabase update error:", error);
        alert("데이터베이스 오류가 발생했습니다.");
        resolve(false);
      } else {
        alert("[테스트 모드] 결제 없이 Pro로 업그레이드되었습니다! 🎉");
        resolve(true);
      }
      return;
    }

    // --- 아래는 나중에 사용할 실제 결제 코드입니다 ---
    /*
    if (!window.IMP) {
      alert("결제 모듈 로드 실패");
      resolve(false);
      return;
    }
    const { IMP } = window;
    IMP.init('imp42866630'); // 테스트 식별코드

    IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name: 'PinAI Pro Plan',
      amount: 4900,
      buyer_email: userEmail,
      m_redirect_url: window.location.href,
    }, async (rsp: any) => {
       // ... (기존 로직)
    });
    */
  });
};