import 'package:flutter/material.dart';
import 'layout.dart';
import '../pages/home_page.dart';
import '../pages/settings_page.dart';

class AppRoutes {
  static final Map<String, RouteConfig> _routeConfigs = {
    '/': RouteConfig(
      title: 'Home',
      icon: Icons.home,
      widget: const HomePage(),
      description: 'Welcome to the home page of our responsive Flutter app.',
      imageUrl: 'https://picsum.photos/400/300?random=1',
    ),
    '/settings': RouteConfig(
      title: 'Settings',
      icon: Icons.settings,
      widget: const SettingsPage(),
      description: 'Customize your app preferences here.',
      imageUrl: 'https://picsum.photos/400/300?random=2',
    ),
  };

  static Map<String, WidgetBuilder> get routes {
    return {
      for (var entry in _routeConfigs.entries)
        entry.key: (context) => GenericPage(config: entry.value),
    };
  }

  static List<RouteConfig> get routeConfigs => _routeConfigs.values.toList();
}

class RouteConfig {
  final String title;
  final IconData icon;
  final Widget widget;
  final String description;
  final String imageUrl;

  RouteConfig({
    required this.title,
    required this.icon,
    required this.widget,
    required this.description,
    required this.imageUrl,
  });
}
