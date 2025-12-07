-- Seed initial problems data
INSERT INTO public.problems (title, description, category, status, location_name, latitude, longitude, upvotes, photos, created_at) VALUES
('Broken Street Light on Siaka Stevens Street', 'The street light has been out for 3 weeks, making it dangerous to walk at night', 'infrastructure', 'reported', 'Siaka Stevens Street, Central Freetown', 8.4657, -13.2317, 45, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '3 days'),

('Overflowing Garbage Bins at King Jimmy Market', 'Multiple garbage bins are overflowing and attracting rats. The smell is unbearable', 'waste', 'in_progress', 'King Jimmy Market', 8.4806, -13.2278, 78, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '5 days'),

('Large Pothole on Wilkinson Road', 'Deep pothole causing vehicle damage and making the road nearly impassable during rain', 'infrastructure', 'reported', 'Wilkinson Road', 8.4900, -13.2343, 92, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '7 days'),

('Illegal Dumping Site Near Congo Cross', 'People are dumping construction waste and creating a health hazard', 'waste', 'reported', 'Congo Cross Area', 8.4723, -13.2156, 34, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '2 days'),

('Broken Water Pipe on Savage Street', 'Burst water pipe wasting clean water and flooding the street', 'infrastructure', 'in_progress', 'Savage Street', 8.4689, -13.2389, 56, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '1 day'),

('Missing Manhole Cover on Circular Road', 'Dangerous open manhole without warning signs. Several near misses reported', 'safety', 'reported', 'Circular Road', 8.4612, -13.2267, 112, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '4 days'),

('Stray Dogs Threat at Lumley Beach', 'Pack of aggressive stray dogs threatening beachgoers, especially children', 'safety', 'reported', 'Lumley Beach', 8.4434, -13.2789, 67, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '6 days'),

('Blocked Drainage System on Main Motor Road', 'Drainage blocked causing severe flooding during heavy rain', 'infrastructure', 'reported', 'Main Motor Road', 8.4778, -13.2234, 89, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '8 days'),

('Damaged School Fence at Government Primary', 'School fence damaged allowing unauthorized access, security concern for children', 'safety', 'resolved', 'Government Primary School, Hill Station', 8.4556, -13.2445, 41, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '15 days'),

('Abandoned Vehicle Blocking Road at Kissy', 'Abandoned vehicle blocking half the road for over a month', 'infrastructure', 'reported', 'Kissy Road', 8.4923, -13.2123, 53, ARRAY['/placeholder.svg?height=400&width=600'], NOW() - INTERVAL '9 days')
ON CONFLICT DO NOTHING;
