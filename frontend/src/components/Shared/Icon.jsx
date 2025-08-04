import React from 'react';

const Icon = ({ name, size = 24, className = "", color = "currentColor" }) => {
  const iconMap = {
    // Основные иконки
    'user': '/icons/392531_account_users_man_friend_human_user_person_member_profile.png',
    'add': '/icons/392530_cross_plus_add_new_create.png',
    'time': '/icons/392529_time_alert_watch_clock_alarm_schedule_history_event.png',
    'gallery': '/icons/392528_gallery_album_photo_image_photos_pictures_images_portfolio.png',
    'database': '/icons/392527_container_business_database_bookmark_boxes_cabinet_catalog_archives_cab_data_archive_box.png',
    'arrow-left': '/icons/392526_left_arrow.png',
    'arrow-right': '/icons/392525_arrow_right.png',
    'award': '/icons/392524_award_big_ceremony_emblem_champion_certificate_cup_badge_conqueror_awards_competitive_game_bronze_best_favorite_choice.png',
    'notification': '/icons/392523_notification_ring_reminder_remind_bell_schedule_ringing_sound.png',
    'delete': '/icons/392522_minus_bin_delete_garbage_cross_remove_cancel_exit_recycle_close_out_empty_trash.png',
    'chat': '/icons/392521_outline_comment_message_bubble_talk_chat.png',
    'image': '/icons/392520_image_pictures_picture_photography_photo_camera_photos.png',
    'view': '/icons/392519_layout_view_display_cascade_stack_sw.png',
    'dashboard': '/icons/392518_meter_fuel_circle_gauge_dashboard.png',
    'close': '/icons/392517_close_delete_remove.png',
    'cloud': '/icons/392516_winter_cloudy_cloud_weather.png',
    'eco': '/icons/392515_flower_paper_ecology_leaf_nature_eco_coda_environment_green_plant.png',
    'coffee': '/icons/392514_drink_hot_cup_tea_coffee.png',
    'compass': '/icons/392513_navigation_compass_direction.png',
    'file': '/icons/392512_file_document_folder_data_documents.png',
    'minus': '/icons/392511_line_minus_delete_premium_no_discart_less_negative_remove_exit.png',
    'print': '/icons/392510_print_page_document_invoice_paper_text_read_file_sheet.png',
    'download': '/icons/392509_down_save_guardar_download.png',
    'wine': '/icons/392508_drink_vine_wine_glass_liquor.png',
    'edit': '/icons/392507_pencil_write_pen_editor_edit.png',
    'email': '/icons/392506_letter_mail_envelope_email.png',
    'eye': '/icons/392505_eye_view_seen_see_preview.png',
    'search': '/icons/392504_find_in_search_magnifying_zoom_research_view_magnifier.png',
    'flag': '/icons/392503_flag_notice_warning.png',
    'location': '/icons/392502_map_marker_location_gps.png',
    'heart': '/icons/392501_vote_like_love_heart.png',
    'home': '/icons/392500_house_home_real_estate.png',
    'security': '/icons/392499_registry_secure_security_password_login_registration_safety_protection_secret_padlock_private_safe_lock_log_locked_register.png',
    'phone': '/icons/392498_call_chat_communication_speech_talk_ringing_smartphone_phones_telephone_phone.png',
    'printer': '/icons/392497_print_printer_printing.png',
    'settings': '/icons/392496_settings_tools_gear_setting.png',
    'sports': '/icons/392495_tennisball_ball_sports_tennis.png',
    'favorite': '/icons/392494_favorite_award_preffered_favourite_favorites_reward_badge_best_bookmark_winner_trophy_star_prize_win.png',
    'upload': '/icons/392493_up_upload.png',
    'check': '/icons/392532_check_accept_ok_yes_tick_outline.png'
  };

  const iconSrc = iconMap[name];
  
  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const getFilter = (color) => {
    if (color === 'currentColor') return 'none';
    if (color === 'black') return 'brightness(0) saturate(100%)';
    if (color === 'white') return 'brightness(0) saturate(100%) invert(1)';
    if (color === '#3B82F6') return 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)';
    if (color === '#FFD700') return 'brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(638%) hue-rotate(359deg) brightness(103%) contrast(107%)';
    return 'none';
  };

  return (
    <img 
      src={iconSrc} 
      alt={name}
      style={{ 
        width: size, 
        height: size,
        filter: getFilter(color)
      }}
      className={className}
    />
  );
};

export default Icon; 