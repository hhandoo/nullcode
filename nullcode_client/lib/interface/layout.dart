import 'package:flutter/material.dart';
import 'routes.dart';

class GenericPage extends StatelessWidget {
  final RouteConfig config;

  const GenericPage({super.key, required this.config});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(context),
      drawer: _buildDrawer(context),
      body: _buildResponsiveBody(context, config),
    );
  }

  AppBar _buildAppBar(BuildContext context) {
    return AppBar(
      title: Text(config.title),
      elevation: 2,
      actions: [
        IconButton(
          icon: const Icon(Icons.info),
          onPressed: () {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(const SnackBar(content: Text('App Version 1.0.0')));
          },
        ),
      ],
    );
  }

  Drawer _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: Colors.teal),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Text(
                  'Navigation Menu',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Explore our app',
                  style: TextStyle(
                    // ignore: deprecated_member_use
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          ...AppRoutes.routeConfigs.map(
            (config) => ListTile(
              leading: Icon(config.icon),
              title: Text(config.title),
              onTap: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.routes.keys.elementAt(
                    AppRoutes.routeConfigs.indexOf(config),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResponsiveBody(BuildContext context, RouteConfig config) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    return SingleChildScrollView(
      child: _buildTextContent(context, config.title, config.description),
    );
  }

  Widget _buildTextContent(
    BuildContext context,
    String title,
    String description,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.headlineMedium?.copyWith(color: Colors.teal[800]),
        ),
        const SizedBox(height: 16),
        Text(description, style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
