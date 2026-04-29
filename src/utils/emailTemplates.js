export const foodClaimedOwnerTemplate = ({ food, ngo, restaurant }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">
      
      <!-- Logo Header -->
      <div style="padding:20px 30px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <img src="https://resqfood-codecaptcha.vercel.app/logo.png" alt="ResQFood" style="height:40px;" />
      </div>

      <div style="padding:30px;">
        <h2 style="margin:0 0 10px 0;color:#111827;">Food Claimed</h2>
        <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
          Your donation has been claimed by an NGO.
        </p>

        <p>Hello <strong>${restaurant.name}</strong>,</p>

        <p style="line-height:1.6;">
          <strong>${ngo.name}</strong> has claimed your food donation. Please keep it ready for pickup.
        </p>

        <!-- Food Image -->
        <div style="margin:20px 0;">
          <img src="${food.food_image?.[0]?.url}" style="width:100%;border-radius:8px;object-fit:cover;max-height:250px;" />
        </div>

        <!-- Details -->
        <div style="background:#f9fafb;padding:15px;border-radius:8px;border:1px solid #e5e7eb;">
          <p><strong>Food:</strong> ${food.food_name}</p>
          <p><strong>Quantity:</strong> ${food.quantity}</p>
          <p><strong>Pickup Before:</strong> ${new Date(food.expiry_time).toLocaleString()}</p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:25px;">
          <a href="https://www.google.com/maps?q=${food.location.coordinates[1]},${food.location.coordinates[0]}"
          style="background:#16a34a;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;">
          View Pickup Location
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:20px;text-align:center;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">
        <a href="https://resqfood-codecaptcha.vercel.app" style="color:#16a34a;text-decoration:none;">
          www.resqfood.com
        </a><br/>
        ResQFood • Reducing food waste efficiently
      </div>

    </div>
  </div>
  `;
};




export const foodClaimedNgoTemplate = ({ food, restaurant }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">
      
      <div style="padding:20px;text-align:center;border-bottom:1px solid #e5e7eb;">
        <img src="https://resqfood-codecaptcha.vercel.app/logo.png" style="height:40px;" />
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111827;margin-bottom:10px;">Pickup Assigned</h2>

        <p>A food donation is ready for collection.</p>

        <!-- Image -->
        <img src="${food.food_image?.[0]?.url}" 
        style="width:100%;border-radius:8px;margin:20px 0;max-height:250px;object-fit:cover;" />

        <!-- Info -->
        <div style="background:#f9fafb;padding:15px;border-radius:8px;border:1px solid #e5e7eb;">
          <p><strong>Food:</strong> ${food.food_name}</p>
          <p><strong>Quantity:</strong> ${food.quantity}</p>
          <p><strong>Donor:</strong> ${restaurant.name}</p>
          <p><strong>Collect Before:</strong> ${new Date(food.expiry_time).toLocaleString()}</p>
        </div>

        <div style="text-align:center;margin-top:25px;">
          <a href="https://www.google.com/maps?q=${food.location.coordinates[1]},${food.location.coordinates[0]}"
          style="background:#16a34a;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;">
          Navigate to Location
          </a>
        </div>
      </div>

      <div style="padding:20px;text-align:center;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">
        <a href="https://resqfood-codecaptcha.vercel.app" style="color:#16a34a;text-decoration:none;">
          www.resqfood.com
        </a><br/>
        ResQFood • Efficient food redistribution
      </div>

    </div>
  </div>
  `;
};



export const foodCollectedNgoTemplate = ({ food, restaurant }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">
      
      <!-- Header -->
      <div style="padding:20px;text-align:center;border-bottom:1px solid #e5e7eb;">
        <img src="https://resqfood-codecaptcha.vercel.app/logo.png" alt="ResQFood" style="height:40px;" />
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="margin:0 0 10px 0;color:#111827;">Collection Confirmed</h2>
        <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
          The pickup has been successfully completed.
        </p>

        <p style="font-size:15px;color:#374151;">
          Thank you for collecting food from <strong>${restaurant.name}</strong>.
        </p>

        <!-- Food Image -->
        <div style="margin:20px 0;">
          <img src="${food.food_image?.[0]?.url}" 
          style="width:100%;border-radius:8px;object-fit:cover;max-height:250px;" />
        </div>

        <!-- Details -->
        <div style="background:#f9fafb;padding:15px;border-radius:8px;border:1px solid #e5e7eb;">
          <p><strong>Food Item:</strong> ${food.food_name}</p>
          <p><strong>Quantity:</strong> ${food.quantity}</p>
        </div>

        <!-- Impact -->
        <p style="margin-top:20px;font-size:14px;color:#6b7280;line-height:1.6;">
          Your action helped ensure that surplus food was redistributed efficiently and responsibly.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px;text-align:center;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">
        <a href="https://resqfood-codecaptcha.vercel.app" style="color:#16a34a;text-decoration:none;">
          www.resqfood.com
        </a><br/>
        ResQFood • Thank you for your contribution
      </div>

    </div>
  </div>
  `;
};



export const foodCollectedOwnerTemplate = ({ food, ngo }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">
      
      <!-- Header -->
      <div style="padding:20px;text-align:center;border-bottom:1px solid #e5e7eb;">
        <img src="https://resqfood-codecaptcha.vercel.app/logo.png" alt="ResQFood" style="height:40px;" />
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="margin:0 0 10px 0;color:#111827;">Donation Completed</h2>
        <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
          Your food donation has been successfully collected.
        </p>

        <p style="font-size:15px;color:#374151;">
          <strong>${ngo.name}</strong> has collected your donation.
        </p>

        <!-- Food Image -->
        <div style="margin:20px 0;">
          <img src="${food.food_image?.[0]?.url}" 
          style="width:100%;border-radius:8px;object-fit:cover;max-height:250px;" />
        </div>

        <!-- Details -->
        <div style="background:#f9fafb;padding:15px;border-radius:8px;border:1px solid #e5e7eb;">
          <p><strong>Food Item:</strong> ${food.food_name}</p>
          <p><strong>Collected By:</strong> ${ngo.name}</p>
        </div>

        <!-- Impact -->
        <p style="margin-top:20px;font-size:14px;color:#6b7280;line-height:1.6;">
          Thank you for helping reduce food waste and supporting your community through ResQFood.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px;text-align:center;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">
        <a href="https://resqfood-codecaptcha.vercel.app" style="color:#16a34a;text-decoration:none;">
          www.resqfood.com
        </a><br/>
        ResQFood • Saving food, serving communities
      </div>

    </div>
  </div>
  `;
};