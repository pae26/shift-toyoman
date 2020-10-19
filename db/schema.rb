# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_19_105047) do

  create_table "next_months", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "day1"
    t.string "day2"
    t.string "day3"
    t.string "day4"
    t.string "day5"
    t.string "day6"
    t.string "day7"
    t.string "day8"
    t.string "day9"
    t.string "day10"
    t.string "day11"
    t.string "day12"
    t.string "day13"
    t.string "day14"
    t.string "day15"
    t.string "day16"
    t.string "day17"
    t.string "day18"
    t.string "day19"
    t.string "day20"
    t.string "day21"
    t.string "day22"
    t.string "day23"
    t.string "day24"
    t.string "day25"
    t.string "day26"
    t.string "day27"
    t.string "day28"
    t.string "day29"
    t.string "day30"
    t.string "day31"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "this_months", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "day1"
    t.string "day2"
    t.string "day3"
    t.string "day4"
    t.string "day5"
    t.string "day6"
    t.string "day7"
    t.string "day8"
    t.string "day9"
    t.string "day10"
    t.string "day11"
    t.string "day12"
    t.string "day13"
    t.string "day14"
    t.string "day15"
    t.string "day16"
    t.string "day17"
    t.string "day18"
    t.string "day19"
    t.string "day20"
    t.string "day21"
    t.string "day22"
    t.string "day23"
    t.string "day24"
    t.string "day25"
    t.string "day26"
    t.string "day27"
    t.string "day28"
    t.string "day29"
    t.string "day30"
    t.string "day31"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
