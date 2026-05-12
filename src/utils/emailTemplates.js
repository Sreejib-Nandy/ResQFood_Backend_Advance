export const welcomeUserTemplate = ({ user }) => {
  const isRestaurant = user.role === "restaurant";
  const isNgo = user.role === "ngo";

  const roleBadge = isRestaurant
    ? { icon: "🍽️ ", label: "Restaurant Partner" }
    : { icon: "🤝 ", label: "NGO Partner" }

  const trialBox =
    isRestaurant && user.status === "trial"
      ? `
      <div style="background: linear-gradient(135deg, #fffbea 0%, #fff8d6 100%); border-left: 4px solid #f0b429; border-radius: 0 12px 12px 0; padding: 18px 22px; margin: 28px 0;">
        <p style="font-size: 13px; font-weight: 600; color: #92660a; margin: 0 0 6px; display: flex; align-items: center; gap: 7px;">
          ⭐ Your 90-day free trial has started
        </p>
        <p style="font-size: 14px; color: #6b5100; line-height: 1.6; margin: 0;">
          Enjoy full access to all features for the next <strong>90 days</strong> —
          no credit card needed. Post donations, track pickups, and connect with NGOs near you, completely free.
        </p>
      </div>
    `
      : "";

  return `
<div style="font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f5f0e8; padding: 40px 16px; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto;">

        <!-- Hero -->
        <div style="background: linear-gradient(145deg, #2d4a22 0%, #3e6b2f 45%, #5c8c42 100%); border-radius: 24px 24px 0 0; padding: 52px 48px 44px; text-align: center; position: relative; overflow: hidden;">
          
          <!-- Logo -->
          <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 32px;">
            <span style="font-family: Georgia, 'Times New Roman', serif; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: 0.3px;">
              🌿 Res<span style="color: #ccff33;">Q</span>Food
            </span>
          </div>

          <p style="font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #a8d88a; margin: 0 0 14px;">
            Welcome aboard
          </p>
          <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 36px; line-height: 1.2; color: #ffffff; margin: 0 0 16px;">
            Every meal shared<br/>is a life <em style="font-style: italic; color: #c8f09a;">touched.</em>
          </h1>
          <p style="font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 360px; margin: 0 auto;">
            You've just joined a community turning surplus into sustenance — one donation at a time.
          </p>
        </div>

        <!-- Amber strip -->
        <div style="background: #f0b429; height: 5px;"></div>

        <!-- Body Card -->
        <div style="background: #fffef9; padding: 48px 48px 40px;">

          <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1f2e13; margin: 0 0 18px;">
            Hello, ${user.name}! 👋
          </h2>

          <p style="font-size: 15px; color: #4a5240; line-height: 1.75; margin: 0 0 16px;">
            We're so glad you're here. Whether you're sharing a meal or receiving one,
            you're now part of something meaningful — a network built on the simple belief
            that good food shouldn't go to waste.
          </p>

          <p style="font-size: 15px; color: #4a5240; line-height: 1.75; margin: 0 0 16px;">
            Your account is set up and ready to go. Here's a quick look at what you've joined:
          </p>

          <!-- Role Badge -->
          <div style="margin: 32px 0; display: flex; align-items: center; gap: 16px; background: #f4f9f0; border: 1.5px solid #c6e0b0; border-radius: 16px; padding: 20px 24px;">
            <span style="font-size: 32px; flex-shrink: 0; margin-right: 4px;">${roleBadge.icon}</span>
            <div>
              <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7aaa55; font-weight: 500; margin: 0 0 4px;">Your role</p>
              <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #2d4a22; margin: 0;">${roleBadge.label}</p>
            </div>
          </div>

          ${trialBox}

          <!-- Steps -->
          <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color: #1f2e13; margin: 0 0 20px;">
            Here's how to get started
          </p>

          <!-- Step 1 -->
          <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
            <div>
              <strong style="font-size: 14px; font-weight: 500; color: #1f2e13; display: block; margin-bottom: 3px;">${isRestaurant ? "1️⃣ Post your first donation" : "1️⃣ Browse available donations"}</strong>
              <span style="font-size: 13px; color: #6b7460; line-height: 1.5;">${isRestaurant ? "Have surplus food? List it in seconds — nearby NGOs will be notified instantly." : "See what's available near you and claim a pickup in just a few taps."}</span>
            </div>
          </div>

          <!-- Step 2 -->
          <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
            <div>
              <strong style="font-size: 14px; font-weight: 500; color: #1f2e13; display: block; margin-bottom: 3px;">2️⃣ Track & celebrate your impact</strong>
              <span style="font-size: 13px; color: #6b7460; line-height: 1.5;">Follow every donation from listing to pickup and see the difference you're making.</span>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin: 36px 0 28px;">
            <a href="https://resqfood-sreejib.vercel.app"
              style="display: inline-block; background: linear-gradient(135deg, #2d4a22, #4a7a32); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; letter-spacing: 0.3px; padding: 16px 40px; border-radius: 50px; box-shadow: 0 8px 24px rgba(45,74,34,0.3);">
              Go to Site →
            </a>
            <p style="font-size: 12px; color: #9aab88; margin: 12px 0 0;">Takes less than 2 minutes to set up your first listing</p>
          </div>

          <!-- Quote -->
          <div style="border-top: 1px solid #e8ede0; padding-top: 28px; margin-top: 28px; text-align: center;">
            <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-style: italic; color: #3e6b2f; line-height: 1.6; margin: 0 0 8px;">
              "The world has enough for everyone's need,<br/>but not enough for everyone's greed."
            </p>
            <p style="font-size: 12px; color: #9aab88; letter-spacing: 1.5px; text-transform: uppercase; margin: 0;">— Mahatma Gandhi</p>
          </div>

        </div>

        <!-- Dot row -->
        <div style="text-align: center; padding: 8px 0; background: #fffef9;">
          <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #c6e0b0; margin: 0 3px;"></span>
          <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #f0b429; margin: 0 3px;"></span>
          <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #c6e0b0; margin: 0 3px;"></span>
        </div>

        <!-- Footer -->
        <div style="background: #2d4a22; border-radius: 0 0 24px 24px; padding: 32px 48px; text-align: center;">
          <p style="font-family: Georgia, 'Times New Roman', serif; color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 12px;">ResQFood</p>
          <div style="margin-bottom: 16px;">
            <a href="https://resqfood-sreejib.vercel.app" style="color: #a8d88a; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
            <span style="color: rgba(255,255,255,0.2);">·</span>
            <a href="https://resqfood-sreejib.vercel.app" style="color: #a8d88a; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
            <span style="color: rgba(255,255,255,0.2);">·</span>
            <a href="https://resqfood-sreejib.vercel.app" style="color: #a8d88a; text-decoration: none; font-size: 13px; margin: 0 12px;">Subscribe</a>
          </div>
          <p style="font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.7; margin: 0;">
            You're receiving this because you signed up at ResQFood.<br/>
            Making food redistribution efficient &amp; impactful.
          </p>
        </div>

      </div>
    </div>
  `;
};



export const foodClaimedNgoTemplate = ({ food, restaurant, otp }) => {
  return `
    <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background: #f0f4f0; padding: 48px 20px; min-height: 100vh;">
    <div style="max-width: 580px; margin: auto;">
 
      <!-- Header Logo Bar -->
      <div style="margin-bottom: 28px; display: flex; justify-content: center; align-items: center;">
        <img src="https://www.shutterstock.com/image-vector/illustration-icon-food-sharing-donation-600nw-2229819277.jpg"
          style="height: 36px; opacity: 0.9;" />
          <p style="color: #000000; font-size: 26px; font-weight: 700; margin: 0 0 6px 6px; letter-spacing: -0.3px;">Res<span style="color: green;">Q</span>Food</p>
      </div>
 
      <!-- Main Card -->
      <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
 
        <!-- Hero Banner -->
        <div style="background: linear-gradient(135deg, #14532d 0%, #16a34a 60%, #22c55e 100%); padding: 32px 32px 0 32px; position: relative;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 5px 14px; margin-bottom: 14px;">
            <span style="color: #d1fae5; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase;">New Assignment</span>
          </div>
          <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.3px;">Pickup Assigned</h1>
          <p style="color: #bbf7d0; font-size: 14px; margin: 0 0 24px;">A food donation is ready for collection. Act before it expires.</p>
 
          <!-- Food Image clipped into banner -->
          <div style="border-radius: 12px 12px 0 0; overflow: hidden; margin: 0 -0px; height: 300px;">
            <img src="${food.food_image?.[0]?.url}"
              style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>
 
        <!-- Body Content -->
        <div style="padding: 28px 32px;">
 
          <!-- Food Details Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
 
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Food Item</p>
              <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${food.food_name}</p>
            </div>
 
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Quantity</p>
              <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${food.quantity}</p>
            </div>
 
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Donor</p>
              <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${restaurant.name}</p>
            </div>
 
            <div style="background: #fef9f0; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #92400e; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Collect Before</p>
              <p style="color: #78350f; font-size: 14px; font-weight: 600; margin: 0;">${new Date(food.expiry_time).toLocaleString()}</p>
            </div>
          </div>
 
          <!-- Divider -->
          <div style="border-top: 1px dashed #d1d5db; margin: 4px 0 24px;"></div>
 
          <!-- OTP Block -->
          <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; border-radius: 16px; padding: 18px 12px; text-align: center; margin-bottom: 24px;">
  
  <p style="color: #166534; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px;">
    &#128274; Show this OTP at the restaurant
  </p>

  <!-- OTP TABLE (responsive) -->
  <table align="center" cellpadding="0" cellspacing="0" style="margin:auto;">
    <tr>
      ${String(otp).split('').map(digit => `
        <td style="padding:4px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="
                width:42px;
                height:50px;
                background:#ffffff;
                border:1.5px solid #4ade80;
                border-radius:10px;
                text-align:center;
                vertical-align:middle;
              ">
                <span style="
                  font-size:22px;
                  font-weight:800;
                  color:#15803d;
                  line-height:50px;
                  display:block;
                ">
                  ${digit}
                </span>
              </td>
            </tr>
          </table>
        </td>
      `).join('')}
    </tr>
  </table>

</div>
 
          <!-- CTA Button -->
          <div style="text-align: center;">
            <a href="https://resqfood-sreejib.vercel.app/ngo/dashboard"
              style="display: inline-block; background: #16a34a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 50px; text-decoration: none; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);">
              &#128205; Navigate to Location
            </a>
          </div>
 
        </div>
      </div>
 
      <!-- Footer -->
      <div style="text-align: center; margin-top: 28px; padding-bottom: 8px;">
        <a href="https://resqfood-sreejib.vercel.app"
          style="color: #16a34a; font-size: 15px; font-weight: 700; text-decoration: none; letter-spacing: -0.2px;">
          ResQFood
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 6px 0 0;">Efficient food redistribution &bull; Making every meal count</p>
      </div>
 
    </div>
  </div>

      <!-- FOOTER -->
      <div style="padding:18px;text-align:center;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
        <p style="margin:0;">
          <a href="https://resqfood-sreejib.vercel.app" style="color:#16a34a;text-decoration:none;font-weight:500;">
            ResQFood
          </a>
        </p>
        <p style="margin:4px 0 0;">Making food redistribution efficient & impactful</p>
      </div>

    </div>
  </div>
  `;
};



export const foodCollectedNgoTemplate = ({ food, restaurant }) => {
  return `
  <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background: #f0f4f0; padding: 48px 20px; min-height: 100vh;">
    <div style="max-width: 580px; margin: auto;">
 
      <!-- Logo -->
<div style="margin-bottom: 28px; display: flex; justify-content: center; align-items: center;">
        <img src="https://www.shutterstock.com/image-vector/illustration-icon-food-sharing-donation-600nw-2229819277.jpg"
          style="height: 36px; opacity: 0.9;" />
          <p style="color: #000000; font-size: 26px; font-weight: 700; margin: 0 0 6px 6px; letter-spacing: -0.3px;">Res<span style="color: green;">Q</span>Food</p>
      </div>
 
      <!-- Main Card -->
      <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
 
        <!-- Hero Banner -->
        <div style="background: linear-gradient(135deg, #14532d 0%, #16a34a 60%, #22c55e 100%); padding: 32px 32px 0 32px;">
          
          <!-- Success Badge -->
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 5px 14px; margin-bottom: 14px;">
            <span style="color: #d1fae5; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">&#10003; Completed</span>
          </div>
 
          <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.3px;">Collection Confirmed</h1>
          <p style="color: #bbf7d0; font-size: 14px; margin: 0 0 24px;">The pickup has been successfully completed.</p>
 
          <!-- Food Image clipped into banner -->
          <div style="border-radius: 12px 12px 0 0; overflow: hidden; height: 300px;">
            <img src="${food.food_image?.[0]?.url}"
              style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>
 
        <!-- Body -->
        <div style="padding: 28px 32px;">
 
          <!-- Thank you message -->
          <p style="font-size: 15px; color: #374151; margin: 0 0 20px; line-height: 1.6;">
            Thank you for collecting food from <strong style="color: #111827;">${restaurant.name}</strong>. Your action helped ensure that surplus food was redistributed efficiently and responsibly.
          </p>
 
          <!-- Divider -->
          <div style="border-top: 1px dashed #d1d5db; margin: 4px 0 20px;"></div>
 
          <!-- Details Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Food Item</p>
              <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 0;">${food.food_name}</p>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;">
              <p style="color: #6b7280; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin: 0 0 4px;">Quantity</p>
              <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 0;">${food.quantity}</p>
            </div>
          </div>
 
          <!-- Impact Block -->
          <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; border-radius: 16px; padding: 20px 22px; display: flex; align-items: flex-start; gap: 14px;">
            <div>
              <p style="color: #14532d; font-size: 13px; font-weight: 700; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.8px;">&#127807; Impact Made</p>
              <p style="color: #166534; font-size: 14px; margin: 0; line-height: 1.5;">
                Every collection counts. You've helped redirect good food to people who need it most.
              </p>
            </div>
          </div>
 
        </div>
      </div>
 
      <!-- Footer -->
      <div style="text-align: center; margin-top: 28px; padding-bottom: 8px;">
        <a href="https://resqfood-sreejib.vercel.app"
          style="color: #16a34a; font-size: 15px; font-weight: 700; text-decoration: none; letter-spacing: -0.2px;">
          ResQFood
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 6px 0 0;">Thank you for your contribution &bull; Making every meal count</p>
      </div>
 
    </div>
  </div>
  `;
};

